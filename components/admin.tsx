"use client";
import { useCallback, useEffect, useState } from "react";
import { MediaLibrary } from "./media-library";
import { services, projects, articles, type Entry } from "@/lib/content";
type Row = {
  id: string;
  kind?: string;
  data?: string;
  files?: string;
  published?: number;
  created_at?: number;
  updated_at?: number;
  status?: string;
  actor?: string;
  action?: string;
  record?: string;
};
const kinds = [
  "submissions",
  "services",
  "projects",
  "articles",
  "jobs",
  "testimonials",
  "settings",
  "audit",
];
export function Admin() {
  const [kind, setKind] = useState("submissions");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [json, setJson] = useState("");
  const [published, setPublished] = useState(false);
  const [inspect, setInspect] = useState<Row | null>(null);
  const load = useCallback(async () => {
    const r = await fetch(
      "/api/admin?kind=" +
        kind +
        "&page=" +
        page +
        "&q=" +
        encodeURIComponent(query),
    );
    const d = (await r.json()) as { error?: string; rows: Row[] };
    if (!r.ok) throw new Error(d.error || "Request failed");
    return d.rows;
  }, [kind, page, query]);
  useEffect(() => {
    let active = true;
    load()
      .then((result) => {
        if (active) {
          setRows(result);
          setError("");
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : "Unable to load records");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [load]);
  async function change(body: Record<string, unknown>) {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = (await r.json()) as { error?: string; rows: Row[] };
      if (!r.ok) throw new Error(d.error || "Request failed");
      setMessage("Saved to persistent storage.");
      setEditing(null);
      setInspect(null);
      setRows(await load());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }
  function edit(row?: Row, data?: Entry) {
    setEditing(row || { id: "new" });
    setJson(
      row?.data ||
        JSON.stringify(
          data || {
            slug: "",
            title: "",
            description: "",
            category: "",
            image: "/images/architecture.jpg",
            body: "",
          },
          null,
          2,
        ),
    );
    if (row?.data) setJson(JSON.stringify(JSON.parse(row.data), null, 2));
    setPublished(row?.published === 1);
  }
  const defaults =
    kind === "services"
      ? services
      : kind === "projects"
        ? projects
        : kind === "articles"
          ? articles
          : [];
  return (
    <section className="section container">
      <div className="notice">
        Administrator access is enforced on every server request. Publish only
        verified company information. Draft entries with the same slug replace
        and unpublish their built-in example.
      </div>
      <div className="admin-tabs">
        {kinds.map((k) => (
          <button
            className={kind === k ? "selected" : ""}
            key={k}
            onClick={() => {
              setKind(k);
              setPage(0);
              setQuery("");
              setQ("");
              setEditing(null);
              setInspect(null);
              setMessage("");
            }}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>
      <form
        className="search-row"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          setQuery(q);
        }}
      >
        <input
          aria-label="Search records"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stored records…"
        />
        <button className="button">Search</button>
        {kind !== "submissions" && kind !== "audit" && (
          <button
            type="button"
            className="button outline"
            onClick={() => edit()}
          >
            New entry
          </button>
        )}
      </form>
      {error && (
        <div role="alert" className="form-message">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="form-message success">
          {message}
        </div>
      )}
      {loading && <p role="status">Loading…</p>}
      {editing && (
        <form
          className="panel"
          style={{ marginTop: 25 }}
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const data = JSON.parse(json);
              void change({
                action: "save",
                kind,
                id: editing.id === "new" ? kind + ":" + data.slug : editing.id,
                data,
                published,
              });
            } catch {
              setError("Enter valid JSON. Your changes have not been saved.");
            }
          }}
        >
          <h3>
            {editing.id === "new" ? "New" : "Edit"} {kind} entry
          </h3>
          <p>
            Use a unique lowercase slug, title, description, category and local
            image path. Optional: body, scope (array), location, status, date,
            verified, quote, author, seoTitle, seoDescription. Existing slugs
            are stable; use a new entry to change a URL.
          </p>
          <label className="field">
            Content JSON
            <textarea
              className="admin-json"
              value={json}
              onChange={(e) => setJson(e.target.value)}
              required
            />
          </label>
          <label className="consent">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish on website
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="button outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button className="button" disabled={loading}>
              Save entry
            </button>
          </div>
        </form>
      )}
      {inspect && (
        <div className="panel admin-record" style={{ marginTop: 25 }}>
          <h3>Submission {inspect.id}</h3>
          <pre>{JSON.stringify(JSON.parse(inspect.data || "{}"), null, 2)}</pre>
          {(JSON.parse(inspect.files || "[]") as { name: string }[]).map(
            (f, i) => (
              <a
                className="text-link"
                style={{ display: "block" }}
                key={i}
                href={"/api/admin/files/" + inspect.id + "?index=" + i}
              >
                Download {f.name}
              </a>
            ),
          )}
          <div className="form-actions">
            <button className="button outline" onClick={() => setInspect(null)}>
              Close
            </button>
            <select
              aria-label="Submission status"
              style={{ maxWidth: 200 }}
              value={inspect.status}
              onChange={(e) =>
                void change({
                  action: "status",
                  kind,
                  id: inspect.id,
                  status: e.target.value,
                })
              }
            >
              <option>new</option>
              <option>reviewing</option>
              <option>closed</option>
            </select>
          </div>
        </div>
      )}
      <div className="admin-list">
        {rows.map((row) => (
          <div className="admin-row" key={row.id}>
            <div>
              <h3>
                {row.data
                  ? JSON.parse(row.data).title || JSON.parse(row.data).name
                  : row.action}
              </h3>
              <p>
                {row.kind || row.record} ·{" "}
                {row.status ||
                  (kind === "audit"
                    ? row.actor
                    : row.published
                      ? "Published"
                      : "Unpublished")}{" "}
                ·{" "}
                {new Date(
                  row.created_at || row.updated_at || 0,
                ).toLocaleString()}
              </p>
            </div>
            {kind !== "audit" && (
              <div>
                <button
                  onClick={() =>
                    kind === "submissions" ? setInspect(row) : edit(row)
                  }
                >
                  {kind === "submissions" ? "View" : "Edit"}
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    if (
                      confirm(
                        kind === "submissions"
                          ? "Permanently delete this submission and its attachments?"
                          : "Remove this entry from the public website? Its unpublished record will be retained.",
                      )
                    )
                      void change({ action: "delete", kind, id: row.id });
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!rows.length && !loading && (
        <p className="empty-state">No stored records found.</p>
      )}
      <div className="form-actions">
        <button
          className="button outline"
          disabled={page === 0 || loading}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="button outline"
          disabled={rows.length < 25 || loading}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {defaults.length > 0 && (
        <div className="panel" style={{ marginTop: 35 }}>
          <h3>Built-in starting content</h3>
          <p>
            Import an example into the editor to customize it. Saving uses its
            slug to override the built-in entry.
          </p>
          <div className="admin-tabs">
            {defaults.map((x) => (
              <button key={x.slug} onClick={() => edit(undefined, x)}>
                {x.title}
              </button>
            ))}
          </div>
        </div>
      )}
      {kind === "settings" && (
        <div className="notice">
          Use slug “company” and verified: true for approved company details.
          Optional fields: email, phone, address, whatsapp (digits only), and
          stats (an array of value/label objects). Published verified settings
          appear in the footer, Contact page and homepage statistics. Never
          publish unverified details.
        </div>
      )}
      <MediaLibrary />
    </section>
  );
}
