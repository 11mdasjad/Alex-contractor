import { env } from "cloudflare:workers";
import { isAdmin, sameOrigin, limitedFormData } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await isAdmin()))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!env.DB)
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const rows = await env.DB.prepare(
    "SELECT id,data FROM content WHERE kind='media' ORDER BY updated_at DESC LIMIT 200",
  ).all<{ id: string; data: string }>();
  return Response.json(
    { media: rows.results.map((r) => ({ id: r.id, ...JSON.parse(r.data) })) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  const user = await isAdmin();
  if (!user || !sameOrigin(request))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!env.DB || !env.BUCKET)
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  let key = "";
  try {
    const form = await limitedFormData(request, 6 * 1024 * 1024);
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !file.size)
      return Response.json(
        { error: "Choose a JPEG or PNG up to 5 MB." },
        { status: 400 },
      );
    const buffer = await file.arrayBuffer();
    const b = new Uint8Array(buffer);
    const png =
      b[0] === 137 &&
      b[1] === 80 &&
      b[2] === 78 &&
      b[3] === 71 &&
      b[4] === 13 &&
      b[5] === 10 &&
      b[6] === 26 &&
      b[7] === 10;
    const jpg = b[0] === 255 && b[1] === 216 && b[2] === 255;
    const type = png ? "image/png" : jpg ? "image/jpeg" : "";
    if (!type || type !== file.type)
      return Response.json(
        {
          error: "The image signature does not match a supported JPEG or PNG.",
        },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    key = "media/" + id;
    const data = {
      title: file.name.slice(0, 200),
      image: "/api/media/" + id,
      key,
      type,
      size: file.size,
    };
    await env.BUCKET.put(key, buffer, { httpMetadata: { contentType: type } });
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO content (id,kind,slug,data,published,updated_at) VALUES (?,?,?,?,1,?)",
      ).bind("media:" + id, "media", id, JSON.stringify(data), Date.now()),
      env.DB.prepare(
        "INSERT INTO audit (id,actor,action,record,created_at) VALUES (?,?,?,?,?)",
      ).bind(
        crypto.randomUUID(),
        user.userId,
        "upload",
        "media:" + id,
        Date.now(),
      ),
    ]);
    return Response.json({ saved: true }, { status: 201 });
  } catch {
    if (key) await env.BUCKET.delete(key);
    return Response.json(
      { error: "Image upload failed. Please try again." },
      { status: 400 },
    );
  }
}
export async function DELETE(request: Request) {
  const user = await isAdmin();
  if (!user || !sameOrigin(request))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!env.DB || !env.BUCKET)
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id?.startsWith("media:"))
      return Response.json({ error: "Invalid media ID" }, { status: 400 });
    const row = await env.DB.prepare(
      "SELECT data FROM content WHERE id=? AND kind='media'",
    )
      .bind(body.id)
      .first<{ data: string }>();
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    const media = JSON.parse(row.data);
    const used = await env.DB.prepare(
      "SELECT id FROM content WHERE kind!='media' AND data LIKE ? LIMIT 1",
    )
      .bind("%" + media.image + "%")
      .first();
    if (used)
      return Response.json(
        {
          error:
            "This image is referenced by content. Remove those references before deleting.",
        },
        { status: 409 },
      );
    await env.BUCKET.delete(media.key);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM content WHERE id=?").bind(body.id),
      env.DB.prepare(
        "INSERT INTO audit (id,actor,action,record,created_at) VALUES (?,?,?,?,?)",
      ).bind(crypto.randomUUID(), user.userId, "delete", body.id, Date.now()),
    ]);
    return Response.json({ saved: true });
  } catch {
    return Response.json({ error: "Delete failed" }, { status: 503 });
  }
}
