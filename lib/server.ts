import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { services, projects, articles, type Entry } from "./content";
export async function isAdmin() {
  const user = await getChatGPTUser();
  const allowed = (env.ADMIN_USER_IDS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return user && allowed.includes(user.userId) ? user : null;
}
export async function catalogue(kind: string): Promise<Entry[]> {
  const fallback =
    kind === "services"
      ? services
      : kind === "projects"
        ? projects
        : kind === "articles"
          ? articles
          : [];
  try {
    if (!env.DB) return fallback;
    const rows = await env.DB.prepare(
      "SELECT slug,data,published FROM content WHERE kind=?",
    )
      .bind(kind)
      .all<{ slug: string; data: string; published: number }>();
    const entries = new Map(fallback.map((e) => [e.slug, e]));
    for (const row of rows.results) {
      if (row.published) entries.set(row.slug, JSON.parse(row.data));
      else entries.delete(row.slug);
    }
    return Array.from(entries.values());
  } catch {
    return fallback;
  }
}
export function sameOrigin(request: Request) {
  const value = request.headers.get("origin");
  return value === new URL(request.url).origin;
}
export async function rateLimit(
  request: Request,
  namespace: string,
  limit = 6,
) {
  if (!env.DB) return false;
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  const bucket = Math.floor(Date.now() / 3600000);
  const key =
    namespace +
    ":" +
    Array.from(new Uint8Array(hash))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("") +
    ":" +
    bucket;
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires < ?")
    .bind(Date.now())
    .run();
  const result = await env.DB.prepare(
    "INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(key, Date.now() + 3600000)
    .first<{ count: number }>();
  return !!result && result.count <= limit;
}

export async function siteSettings() {
  return (
    (await catalogue("settings")).find(
      (x) => x.slug === "company" && x.verified,
    ) || null
  );
}
export async function limitedFormData(
  request: Request,
  max = 16 * 1024 * 1024,
) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new Error("Upload exceeds the allowed request size.");
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return new Response(buffer, {
    headers: { "Content-Type": request.headers.get("content-type") || "" },
  }).formData();
}
