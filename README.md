# ADEX Engineering & Contracting

A responsive corporate website based on the supplied ADEX design reference. React 19, TypeScript, Next-compatible App Router through Vinext, custom CSS, Lucide, Cloudflare D1 / Drizzle and private R2 storage. The source is designed for OpenAI Sites' Cloudflare Worker runtime; a separate Next.js build supports Vercel hosting.

## Run locally

Requires Node 22.13+.

```sh
npm install
npm run db:generate # only after modifying db/schema.ts
npm run build
# Apply each pending SQL migration once to your local database:
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_powerful_magdalene.sql
npm run dev
```

Replace the migration filename above with the actual SQL file in `drizzle/`. `npm run start` serves the built Worker. `.wrangler/state` persists local D1/R2 data. Local data and hosted data are separate.

## Routes

`/`, `/about`, `/services`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/process`, `/quality-safety`, `/careers`, `/careers/[slug]`, `/insights`, `/insights/[slug]`, `/contact`, `/quote`, `/faq`, `/privacy`, `/terms`, `/search`, `/admin`, `/sitemap.xml`, `/robots.txt`, and a branded 404.

## Data and administration

- D1 tables: submissions, content, audit, rate_limits. Schema in `db/schema.ts`; tracked Drizzle migrations in `drizzle/`.
- R2 stores private attachments. Only authorized `/api/admin/files/[id]?index=N` requests may retrieve them. Downloads use attachment disposition, octet-stream content and no-store.
- Public forms validate server-side, enforce same-origin writes, use a honeypot and a durable per-IP hourly request limit. Limits are conservative and can affect shared networks.
- Upload limits: 3 files / 5 MB each / 15 MB total; PDF, JPEG, PNG validated against MIME and file signature. Job resumes accept one PDF. Files are not malware-scanned; administrators should scan downloads before opening.
- A successful submission means a D1 record was stored. Optional email is only a notification. Failed notifications do not discard enquiries or fabricate email delivery.
- No current jobs, invented testimonials, unverifiable performance statistics or contact details are seeded.
- Administrator access is denied by default. Configure `ADMIN_USER_IDS` with the stable, Site-specific ChatGPT user IDs of authorized staff. Sign-in is supplied by Sites; every API verifies the allowlist. Never put this list in client code or trust client-provided identity outside the Sites gateway.
- Local preview includes the starter's localhost-only mock identity. For local admin testing, set `ADMIN_USER_IDS=local_seedy` in ignored `.dev.vars` (confirm the ID in the starter plugin). Never configure mock identities in production.
- Admin supports JSON-based content creation/editing, publication, unpublication, searching and pagination; enquiry/application review, status and permanent deletion; audit records. Editing example content uses its existing slug. Delete of content retains an unpublished record to prevent fallback examples from reappearing. Submission deletion removes its private attachments first.
- Before changing an existing content slug, create a new entry and unpublish the original. URLs are stable identifiers.

## Configuration

`.env.example` documents values; configure runtime secrets through Sites. Never commit real credentials.

- `ADMIN_USER_IDS`: required to unlock administrative access.
- `RESEND_API_KEY`, `ENQUIRY_EMAIL_TO`, `EMAIL_FROM`: optional notification delivery; sender must be verified with the email provider.
- D1 binding `DB` and R2 binding `BUCKET`: declared in `.openai/hosting.json`; Sites provisions hosted resources.

Verified settings use the company slug, verified: true, and optional email, phone, address, whatsapp and stats fields. These populate the footer, Contact page and homepage. Entry seoTitle and seoDescription override detail-page metadata. The media library uploads approved JPEG/PNG assets and provides reusable paths; private enquiry files are managed separately.

Public marketing content starts in `lib/content.ts`; persisted CMS records override it by slug. Company contacts, approved credentials, genuine projects, testimonials, policies and original logo must be supplied/verified before public launch. Do not set `verified: true` for invented content. Legal pages are expressly marked drafts. The Site is initially owner-private.

## Deployment

Use the Sites skill build/package workflow. `.openai/hosting.json` retains the project ID and DB/BUCKET bindings. Run TypeScript, lint and build checks. Push the exact source state and package the built Worker with the hosting manifest, then save and deploy a private Site version. The hosting platform applies the tracked migrations. Do not edit already applied migration files. Add schema changes through new Drizzle migrations.

For another Cloudflare deployment, configure the same bindings and secrets and apply the same migration sequence. Preserve trusted gateway identity semantics; a raw Worker without the Sites identity gateway must not accept spoofable authentication headers.

## Verification

See `TESTING.md` for checks actually executed and remaining configuration limits. All photography and example portfolio entries are illustrative. See `ASSETS.md` for sources.

## Vercel deployment

`vercel.json` selects Next.js and `npm run build:vercel`, which creates `.next/routes-manifest.json`. Node is pinned to 22.x. Leave the Vercel project build/output overrides at the repository defaults. Use `npm run start:vercel` to serve this build locally. The existing Vinext build remains available for Sites/Cloudflare.

Vercel serves the public pages and bundled catalogue. Cloudflare D1/R2 storage and the trusted Sites sign-in gateway are not available there. Enquiry submissions and uploads return an explicit unavailable response until a persistent storage integration is configured; admin access is disabled. No submitted data is silently accepted or discarded. Keep using the existing Sites deployment for those backend features. Never trust incoming `oai-authenticated-*` headers on Vercel.
