import { env } from "cloudflare:workers";
import { z } from "zod";
import {
  sameOrigin,
  rateLimit,
  catalogue,
  limitedFormData,
} from "@/lib/server";
export const dynamic = "force-dynamic";
const schema = z.object({
  kind: z.enum(["contact", "quote", "application"]),
  name: z.string().trim().min(2).max(200),
  email: z.string().email().max(254),
  phone: z
    .string()
    .regex(/^[+0-9() .-]{7,25}$/)
    .refine((v) => v.replace(/\D/g, "").length >= 7),
  company: z.string().max(200).optional(),
  service: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters of project details.")
    .max(6000),
  budget: z.string().max(200).optional(),
  timeline: z.string().max(200).optional(),
  job: z.string().max(200).optional(),
  consent: z.literal("true"),
});
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "This submission must come from the website." },
      { status: 403 },
    );
  if (!env.DB || !env.BUCKET)
    return Response.json(
      {
        error:
          "Enquiry storage is not configured. Please try again after the service is enabled.",
      },
      { status: 503 },
    );
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16 * 1024 * 1024)
    return Response.json(
      { error: "Attachments exceed the total upload limit." },
      { status: 413 },
    );
  try {
    if (!(await rateLimit(request, "enquiries")))
      return Response.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429 },
      );
    const form = await limitedFormData(request);
    if (form.get("website"))
      return Response.json(
        { error: "Submission rejected. Please leave the website field empty." },
        { status: 400 },
      );
    const parsed = schema.safeParse(
      Object.fromEntries([...form.entries()].filter(([k]) => k !== "files")),
    );
    if (!parsed.success)
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const data = parsed.data;
    if (data.kind !== "application" && (!data.service || !data.location))
      return Response.json(
        { error: "Project type and location are required." },
        { status: 400 },
      );
    if (data.kind === "quote" && (!data.budget || !data.timeline))
      return Response.json(
        { error: "Budget and timeline selections are required." },
        { status: 400 },
      );
    if (
      data.kind === "application" &&
      !(await catalogue("jobs")).some((j) => j.slug === data.job)
    )
      return Response.json(
        { error: "This position is not currently open." },
        { status: 400 },
      );
    const files = form
      .getAll("files")
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (
      files.length > (data.kind === "application" ? 1 : 3) ||
      files.reduce((s, f) => s + f.size, 0) > 15 * 1024 * 1024
    )
      return Response.json(
        { error: "Too many files or total size exceeded." },
        { status: 400 },
      );
    const checked: {
      file: File;
      bytes: ArrayBuffer;
      mime: string;
      extension: string;
    }[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024)
        return Response.json(
          { error: "Each file must be 5 MB or smaller." },
          { status: 400 },
        );
      const bytes = await file.arrayBuffer();
      const magic = new Uint8Array(bytes);
      const pdf = String.fromCharCode(...magic.slice(0, 5)) === "%PDF-";
      const png =
        magic[0] === 137 &&
        magic[1] === 80 &&
        magic[2] === 78 &&
        magic[3] === 71 &&
        magic[4] === 13 &&
        magic[5] === 10 &&
        magic[6] === 26 &&
        magic[7] === 10;
      const jpg = magic[0] === 255 && magic[1] === 216 && magic[2] === 255;
      const mime = pdf
        ? "application/pdf"
        : png
          ? "image/png"
          : jpg
            ? "image/jpeg"
            : "";
      if (!mime || file.type !== mime || (data.kind === "application" && !pdf))
        return Response.json(
          {
            error:
              "Only valid PDF, JPEG and PNG files are accepted. Resumes must be PDF.",
          },
          { status: 400 },
        );
      checked.push({
        file,
        bytes,
        mime,
        extension: pdf ? "pdf" : png ? "png" : "jpg",
      });
    }
    const id = crypto.randomUUID();
    const uploaded: {
      key: string;
      name: string;
      type: string;
      size: number;
    }[] = [];
    try {
      for (const { file, bytes, mime, extension } of checked) {
        const key =
          "submissions/" + id + "/" + crypto.randomUUID() + "." + extension;
        await env.BUCKET.put(key, bytes, {
          httpMetadata: { contentType: mime, contentDisposition: "attachment" },
        });
        uploaded.push({
          key,
          name: file.name.replace(/[\r\n<>]/g, "").slice(0, 200),
          type: mime,
          size: file.size,
        });
      }
      await env.DB.prepare(
        "INSERT INTO submissions (id,kind,data,files,created_at,status) VALUES (?,?,?,?,?,?)",
      )
        .bind(
          id,
          data.kind,
          JSON.stringify(data),
          JSON.stringify(uploaded),
          Date.now(),
          "new",
        )
        .run();
    } catch (error) {
      await Promise.allSettled(uploaded.map((f) => env.BUCKET!.delete(f.key)));
      throw error;
    }
    // Persist first. Email is an optional notification, never the source of truth.
    if (env.RESEND_API_KEY && env.ENQUIRY_EMAIL_TO && env.EMAIL_FROM) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.RESEND_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.EMAIL_FROM,
            to: [env.ENQUIRY_EMAIL_TO],
            subject: "New ADEX " + data.kind + " enquiry",
            text:
              "A new enquiry has been saved. Reference: " +
              id +
              ". Sign in to the protected ADEX admin dashboard to review it.",
          }),
        });
        if (!response.ok)
          console.error("Enquiry email notification failed", response.status);
      } catch {
        console.error("Enquiry email notification unavailable");
      }
    }
    return Response.json(
      { id, saved: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("Enquiry persistence failed");
    return Response.json(
      {
        error:
          "Your enquiry could not be saved. Please try again later; no success has been recorded.",
      },
      { status: 503 },
    );
  }
}
