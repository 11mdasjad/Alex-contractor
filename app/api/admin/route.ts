import { env } from "cloudflare:workers";
import { z } from "zod";
import { isAdmin, sameOrigin } from "@/lib/server";
export const dynamic = "force-dynamic";
const types = [
  "services",
  "projects",
  "articles",
  "jobs",
  "testimonials",
  "settings",
] as const;
const entrySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  category: z.string().max(100).default(""),
  image: z
    .string()
    .regex(/^(\/images\/[a-zA-Z0-9._-]+|\/api\/media\/[0-9a-f-]{36})$/)
    .default("/images/architecture.jpg"),
  body: z.string().max(30000).optional(),
  scope: z.array(z.string().max(500)).max(30).optional(),
  location: z.string().max(200).optional(),
  status: z.string().max(100).optional(),
  date: z.string().max(100).optional(),
  verified: z.boolean().optional(),
  quote: z.string().max(3000).optional(),
  author: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^[+0-9() .-]{7,25}$/)
    .optional(),
  address: z.string().max(1000).optional(),
  whatsapp: z
    .string()
    .regex(/^[0-9]{7,15}$/)
    .optional(),
  stats: z
    .array(z.object({ value: z.string().max(40), label: z.string().max(100) }))
    .max(4)
    .optional(),
  seoTitle: z.string().max(150).optional(),
  seoDescription: z.string().max(300).optional(),
});
export async function GET(request: Request) {
  if (!(await isAdmin()))
    return Response.json(
      { error: "Authorized administrator access is required." },
      { status: 403 },
    );
  if (!env.DB)
    return Response.json({ error: "Database unavailable." }, { status: 503 });
  try {
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") || "submissions";
    const page = Math.max(
      0,
      Math.min(100000, Number(url.searchParams.get("page")) || 0),
    );
    const query = (url.searchParams.get("q") || "").slice(0, 200);
    if (kind === "audit") {
      const rows = await env.DB.prepare(
        "SELECT * FROM audit ORDER BY created_at DESC LIMIT 25 OFFSET ?",
      )
        .bind(page * 25)
        .all();
      return Response.json(
        { rows: rows.results },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (kind === "submissions") {
      const rows = await env.DB.prepare(
        "SELECT * FROM submissions WHERE data LIKE ? ORDER BY created_at DESC LIMIT 25 OFFSET ?",
      )
        .bind("%" + query + "%", page * 25)
        .all();
      return Response.json(
        { rows: rows.results },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (!types.includes(kind as (typeof types)[number]))
      return Response.json({ error: "Unknown content type." }, { status: 400 });
    const rows = await env.DB.prepare(
      "SELECT * FROM content WHERE kind=? AND data LIKE ? ORDER BY updated_at DESC LIMIT 25 OFFSET ?",
    )
      .bind(kind, "%" + query + "%", page * 25)
      .all();
    return Response.json(
      { rows: rows.results },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Records could not be loaded." },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  const admin = await isAdmin();
  if (!admin)
    return Response.json(
      { error: "Authorized administrator access is required." },
      { status: 403 },
    );
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!env.DB)
    return Response.json({ error: "Database unavailable." }, { status: 503 });
  if (Number(request.headers.get("content-length") || 0) > 100000)
    return Response.json({ error: "Request too large." }, { status: 413 });
  try {
    const body = z.record(z.unknown()).parse(await request.json());
    const action = z.enum(["save", "delete", "status"]).parse(body.action);
    const id = z.string().min(1).max(200).parse(body.id);
    const kind = z.enum(["submissions", ...types]).parse(body.kind);
    const audit = env.DB.prepare(
      "INSERT INTO audit (id,actor,action,record,created_at) VALUES (?,?,?,?,?)",
    ).bind(
      crypto.randomUUID(),
      admin.userId,
      action,
      kind + ":" + id,
      Date.now(),
    );
    if (kind === "submissions") {
      if (action === "status") {
        const status = z
          .enum(["new", "reviewing", "closed"])
          .parse(body.status);
        await env.DB.batch([
          env.DB.prepare("UPDATE submissions SET status=? WHERE id=?").bind(
            status,
            id,
          ),
          audit,
        ]);
      } else if (action === "delete") {
        const row = await env.DB.prepare(
          "SELECT files FROM submissions WHERE id=?",
        )
          .bind(id)
          .first<{ files: string }>();
        if (row) {
          const files = JSON.parse(row.files) as { key: string }[];
          if (files.length && !env.BUCKET)
            return Response.json(
              {
                error: "File storage unavailable; deletion was not performed.",
              },
              { status: 503 },
            );
          for (const f of files) await env.BUCKET!.delete(f.key);
        }
        await env.DB.batch([
          env.DB.prepare("DELETE FROM submissions WHERE id=?").bind(id),
          audit,
        ]);
      } else
        return Response.json({ error: "Unsupported action." }, { status: 400 });
    } else if (action === "save") {
      const data = entrySchema.parse(body.data);
      const published = z.boolean().parse(body.published);
      if (
        kind === "testimonials" &&
        published &&
        (!data.verified || !data.author)
      )
        return Response.json(
          { error: "Publish only verified testimonials with an author." },
          { status: 400 },
        );
      if (kind === "settings" && published && !data.verified)
        return Response.json(
          { error: "Company settings must be verified before publication." },
          { status: 400 },
        );
      const recordId = kind + ":" + data.slug;
      await env.DB.batch([
        env.DB.prepare(
          "INSERT INTO content (id,kind,slug,data,published,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,published=excluded.published,updated_at=excluded.updated_at",
        ).bind(
          recordId,
          kind,
          data.slug,
          JSON.stringify(data),
          published ? 1 : 0,
          Date.now(),
        ),
        audit,
      ]);
    } else if (action === "delete") {
      // Keep a tombstone so deleting seeded content cannot republish its fallback.
      const row = await env.DB.prepare(
        "SELECT slug FROM content WHERE id=? AND kind=?",
      )
        .bind(id, kind)
        .first<{ slug: string }>();
      if (row)
        await env.DB.batch([
          env.DB.prepare(
            "UPDATE content SET published=0,updated_at=? WHERE id=? AND kind=?",
          ).bind(Date.now(), id, kind),
          audit,
        ]);
    } else
      return Response.json({ error: "Unsupported action." }, { status: 400 });
    return Response.json({ saved: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof z.ZodError
            ? error.issues[0].message
            : "The change could not be saved.",
      },
      { status: error instanceof z.ZodError ? 400 : 503 },
    );
  }
}
