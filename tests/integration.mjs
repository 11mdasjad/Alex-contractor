import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw new Error(
    "Run this destructive synthetic-data suite only against localhost.",
  );
const auth = { Cookie: "__sites_local_auth=1", Origin: base };
let count = 0;
async function check(label, fn) {
  await fn();
  console.log("PASS " + label);
  count++;
}
const pages = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/process",
  "/quality-safety",
  "/careers",
  "/insights",
  "/contact",
  "/quote",
  "/faq",
  "/privacy",
  "/terms",
  "/search?q=construction",
  "/admin",
  "/sitemap.xml",
  "/robots.txt",
];
const visited = new Set();
const links = new Set();
await check("all primary routes and metadata endpoints", async () => {
  for (const path of pages) {
    const r = await fetch(base + path);
    assert.equal(r.status, 200, path);
    const html = await r.text();
    visited.add(path);
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      if (
        !m[1].startsWith("/_") &&
        !m[1].startsWith("/signin") &&
        !m[1].startsWith("/@")
      )
        links.add(m[1]);
    }
    if (!path.endsWith(".xml") && !path.endsWith(".txt"))
      assert.match(html, /<title>/);
  }
});
await check("internal links and detail pages", async () => {
  for (const path of links) {
    if (visited.has(path)) continue;
    const r = await fetch(base + path);
    assert.equal(r.status, 200, path);
    visited.add(path);
  }
});
await check("custom missing-page response", async () => {
  const r = await fetch(base + "/not-a-real-adex-page");
  assert.equal(r.status, 404);
  assert.match(await r.text(), /A different path forward/);
});
await check("unauthorized admin read write and download denied", async () => {
  for (const [path, method] of [
    ["/api/admin", "GET"],
    ["/api/admin", "POST"],
    ["/api/admin/files/missing", "GET"],
    ["/api/admin/media", "GET"],
  ])
    assert.equal((await fetch(base + path, { method })).status, 403);
});
await check("authenticated admin can read local database", async () => {
  assert.equal(
    (await fetch(base + "/api/admin", { headers: auth })).status,
    200,
  );
});
await check("cross-origin enquiry rejected", async () => {
  assert.equal(
    (
      await fetch(base + "/api/enquiries", {
        method: "POST",
        headers: { Origin: "https://example.invalid" },
      })
    ).status,
    403,
  );
});
let counter = 0;
function form(overrides = {}, file) {
  const f = new FormData();
  for (const [k, v] of Object.entries({
    kind: "contact",
    name: "QA Synthetic Test",
    email: "qa@example.invalid",
    phone: "0000000000",
    company: "Automated test only",
    service: "Building Construction",
    location: "Test environment",
    description: "Synthetic local-only integration test record.",
    consent: "true",
    ...overrides,
  }))
    f.set(k, v);
  if (file) f.append("files", file.blob, file.name);
  return f;
}
async function post(f, ip) {
  return fetch(base + "/api/enquiries", {
    method: "POST",
    headers: {
      Origin: base,
      "CF-Connecting-IP": ip || "test-" + Date.now() + "-" + counter++,
    },
    body: f,
  });
}
await check("invalid email rejected on server", async () => {
  assert.equal((await post(form({ email: "invalid" }))).status, 400);
});
await check("missing project scope rejected", async () => {
  assert.equal((await post(form({ description: "" }))).status, 400);
});
await check("invalid signature upload rejected", async () => {
  assert.equal(
    (
      await post(
        form(
          {},
          {
            blob: new Blob(["not a PDF"], { type: "application/pdf" }),
            name: "invalid.pdf",
          },
        ),
      )
    ).status,
    400,
  );
});
await check("oversize upload rejected", async () => {
  assert.ok(
    [400, 413].includes(
      (
        await post(
          form(
            {},
            {
              blob: new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], {
                type: "application/pdf",
              }),
              name: "large.pdf",
            },
          ),
        )
      ).status,
    ),
  );
});
let submissionId;
await check("valid quote and PDF attachment saved", async () => {
  const r = await post(
    form(
      {
        kind: "quote",
        budget: "To be discussed",
        timeline: "Exploring options",
      },
      {
        blob: new Blob(["%PDF-1.4\n% Synthetic test document\n%%EOF"], {
          type: "application/pdf",
        }),
        name: "qa.pdf",
      },
    ),
  );
  assert.equal(r.status, 201, await r.clone().text());
  submissionId = (await r.json()).id;
  assert.ok(submissionId);
});
await check("saved enquiry persists on independent read", async () => {
  const r = await fetch(base + "/api/admin?kind=submissions&q=Synthetic", {
    headers: auth,
  });
  assert.ok((await r.json()).rows.some((x) => x.id === submissionId));
});
await check("authorized attachment download and safe headers", async () => {
  const r = await fetch(
    base + "/api/admin/files/" + submissionId + "?index=0",
    { headers: auth },
  );
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("content-type"), "application/octet-stream");
  assert.match(r.headers.get("content-disposition"), /attachment/);
  assert.match(await r.text(), /%PDF/);
});
async function admin(body, headers = auth) {
  return fetch(base + "/api/admin", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
await check("admin CSRF enforcement", async () => {
  assert.equal(
    (await admin({}, { ...auth, Origin: "https://example.invalid" })).status,
    403,
  );
});
await check("enquiry status update persists", async () => {
  assert.equal(
    (
      await admin({
        action: "status",
        kind: "submissions",
        id: submissionId,
        status: "reviewing",
      })
    ).status,
    200,
  );
  const r = await fetch(base + "/api/admin?kind=submissions&q=Synthetic", {
    headers: auth,
  });
  assert.equal(
    (await r.json()).rows.find((x) => x.id === submissionId).status,
    "reviewing",
  );
});
const job = {
  slug: "qa-temporary-role",
  title: "QA Temporary Role",
  description: "Synthetic job only for local integration verification.",
  category: "Engineering",
  image: "/images/engineers.jpg",
  body: "Test-only opportunity; never published to hosted storage.",
};
await check("CMS job create publish and public detail", async () => {
  assert.equal(
    (
      await admin({
        action: "save",
        kind: "jobs",
        id: "jobs:" + job.slug,
        data: job,
        published: true,
      })
    ).status,
    200,
  );
  const r = await fetch(base + "/careers/" + job.slug);
  assert.equal(r.status, 200);
  assert.match(await r.text(), /QA Temporary Role/);
});
let applicationId;
await check("job application persists", async () => {
  const r = await post(
    form(
      { kind: "application", job: job.slug },
      {
        blob: new Blob(["%PDF-1.4\n% Resume QA\n%%EOF"], {
          type: "application/pdf",
        }),
        name: "resume.pdf",
      },
    ),
  );
  assert.equal(r.status, 201);
  applicationId = (await r.json()).id;
});
await check("CMS unpublish removes job and rejects applications", async () => {
  assert.equal(
    (await admin({ action: "delete", kind: "jobs", id: "jobs:" + job.slug }))
      .status,
    200,
  );
  assert.equal((await fetch(base + "/careers/" + job.slug)).status, 404);
  assert.equal(
    (await post(form({ kind: "application", job: job.slug }))).status,
    400,
  );
});
let mediaId, mediaPath;
await check("media upload persists and is readable", async () => {
  const f = new FormData();
  f.set(
    "file",
    new Blob([await readFile("public/images/residential.jpg")], {
      type: "image/jpeg",
    }),
    "qa-only.jpg",
  );
  const r = await fetch(base + "/api/admin/media", {
    method: "POST",
    headers: auth,
    body: f,
  });
  assert.equal(r.status, 201, await r.clone().text());
  const list = await (
    await fetch(base + "/api/admin/media", { headers: auth })
  ).json();
  const m = list.media.find((x) => x.title === "qa-only.jpg");
  mediaId = m.id;
  mediaPath = m.image;
  assert.equal((await fetch(base + mediaPath)).status, 200);
});
await check("media delete removes asset", async () => {
  const r = await fetch(base + "/api/admin/media", {
    method: "DELETE",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ id: mediaId }),
  });
  assert.equal(r.status, 200);
  assert.equal((await fetch(base + mediaPath)).status, 404);
});
await check(
  "verified company settings appear and unpublish correctly",
  async () => {
    const data = {
      slug: "company",
      title: "Company details",
      description: "Local QA settings only",
      category: "Settings",
      image: "/images/hero.jpg",
      verified: true,
      email: "verified-qa@example.invalid",
      stats: [{ value: "QA", label: "Synthetic statistic" }],
    };
    assert.equal(
      (
        await admin({
          action: "save",
          kind: "settings",
          id: "settings:company",
          data,
          published: true,
        })
      ).status,
      200,
    );
    assert.match(
      await (await fetch(base + "/contact")).text(),
      /verified-qa@example.invalid/,
    );
    assert.match(await (await fetch(base + "/")).text(), /Synthetic statistic/);
    assert.equal(
      (
        await admin({
          action: "delete",
          kind: "settings",
          id: "settings:company",
        })
      ).status,
      200,
    );
    assert.doesNotMatch(
      await (await fetch(base + "/contact")).text(),
      /verified-qa@example.invalid/,
    );
  },
);
await check("rate limit is enforced after six requests", async () => {
  const ip = "rate-test-" + Date.now();
  for (let i = 0; i < 6; i++)
    assert.equal((await post(form({ email: "bad" }), ip)).status, 400);
  assert.equal((await post(form({ email: "bad" }), ip)).status, 429);
});
await check("synthetic enquiry deletion removes files and data", async () => {
  for (const id of [submissionId, applicationId])
    assert.equal(
      (await admin({ action: "delete", kind: "submissions", id })).status,
      200,
    );
  assert.equal(
    (
      await fetch(base + "/api/admin/files/" + submissionId + "?index=0", {
        headers: auth,
      })
    ).status,
    404,
  );
});
await check("audit records exist", async () => {
  const r = await fetch(base + "/api/admin?kind=audit", { headers: auth });
  assert.ok((await r.json()).rows.length >= 5);
});
console.log(
  JSON.stringify({ checks: count, routes: visited.size, status: "passed" }),
);
