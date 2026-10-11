import { env } from "@/lib/runtime";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!env.DB || !env.BUCKET)
    return new Response("Unavailable", { status: 503 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id))
    return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare(
    "SELECT data FROM content WHERE id=? AND kind='media' AND published=1",
  )
    .bind("media:" + id)
    .first<{ data: string }>();
  if (!row) return new Response("Not found", { status: 404 });
  const data = JSON.parse(row.data);
  const file = await env.BUCKET.get(data.key);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.body, {
    headers: {
      "Content-Type": data.type,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
