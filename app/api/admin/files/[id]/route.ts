import { env } from "cloudflare:workers";
import { isAdmin } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return new Response("Forbidden", { status: 403 });
  if (!env.DB || !env.BUCKET)
    return new Response("Storage unavailable", { status: 503 });
  try {
    const { id } = await params;
    const row = await env.DB.prepare("SELECT files FROM submissions WHERE id=?")
      .bind(id)
      .first<{ files: string }>();
    const index = Number(new URL(request.url).searchParams.get("index"));
    if (!row || !Number.isInteger(index) || index < 0)
      return new Response("Not found", { status: 404 });
    const file = JSON.parse(row.files)[index] as
      | { key: string; name: string; type: string }
      | undefined;
    if (!file) return new Response("Not found", { status: 404 });
    const object = await env.BUCKET.get(file.key);
    if (!object) return new Response("Not found", { status: 404 });
    return new Response(object.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition":
          "attachment; filename*=UTF-8''" + encodeURIComponent(file.name),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("File unavailable", { status: 503 });
  }
}
