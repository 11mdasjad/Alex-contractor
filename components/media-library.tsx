"use client";
import { useEffect, useState } from "react";
import { Photo } from "./site";
type Media = { id: string; title: string; image: string };
const builtins = [
  "hero",
  "architecture",
  "residential",
  "construction",
  "engineers",
  "interior",
  "industrial",
].map((x) => ({ id: x, title: x, image: "/images/" + x + ".jpg" }));
export function MediaLibrary() {
  const [media, setMedia] = useState<Media[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  async function read() {
    const r = await fetch("/api/admin/media");
    const data = (await r.json()) as { media: Media[]; error?: string };
    if (!r.ok) throw new Error(data.error || "Load failed");
    return data.media;
  }
  useEffect(() => {
    let active = true;
    read()
      .then((d) => {
        if (active) setMedia(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const filtered = [...builtins, ...media].filter((x) =>
    x.title.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="panel" style={{ marginTop: 30 }}>
      <h2>Media library</h2>
      <p>
        Upload only company-approved photography that you are authorized to
        publish. Uploaded images are public assets. Enquiry attachments remain
        private.
      </p>
      <form
        className="search-row"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setBusy(true);
          setError("");
          try {
            const r = await fetch("/api/admin/media", {
              method: "POST",
              body: new FormData(form),
            });
            const d = (await r.json()) as { error?: string };
            if (!r.ok) throw new Error(d.error);
            setMedia(await read());
            form.reset();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <input
          type="file"
          name="file"
          accept=".jpg,.jpeg,.png"
          required
          aria-label="Image to add to media library"
        />
        <button className="button" disabled={busy}>
          {busy ? "Uploading…" : "Upload image"}
        </button>
      </form>
      {error && (
        <div className="form-message" role="alert">
          {error}
        </div>
      )}
      <label className="field" style={{ marginBlock: 20 }}>
        Search images
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
      </label>
      <div className="articles-grid">
        {filtered.slice(page * 9, page * 9 + 9).map((m) => (
          <div className="panel" key={m.id}>
            <Photo src={m.image} alt={m.title} />
            <p>{m.title}</p>
            <label className="field">
              Image path
              <input
                value={m.image}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            {m.id.startsWith("media:") && (
              <button
                className="button outline"
                style={{ marginTop: 15 }}
                onClick={async () => {
                  if (!confirm("Permanently delete this uploaded image?"))
                    return;
                  try {
                    const r = await fetch("/api/admin/media", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: m.id }),
                    });
                    const d = (await r.json()) as { error?: string };
                    if (!r.ok) throw new Error(d.error);
                    setMedia(await read());
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Delete failed");
                  }
                }}
              >
                Delete image
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button
          className="button outline"
          disabled={!page}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="button outline"
          disabled={(page + 1) * 9 >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
