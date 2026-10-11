# Verification results

Executed on 12 October 2026 (Asia/Kolkata).

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed, no warnings/errors.
- Production Worker build through Sites build helper: passed; repeated during final packaging.
- `node tests/integration.mjs`: 24 checks passed; 44 routes and linked pages returned the expected responses.
- Local D1 migration applied successfully. Independent reads confirmed saved enquiries, job applications, CMS records, company settings and audit events. R2 upload/download and removal tested.
- Verified unauthorized reads/writes/downloads return 403, same-origin restrictions, server email/scope validation, file signatures and size limits, six-request hourly rate limit, CMS publication/unpublication, private attachment disposition and enquiry status updates.
- Local browser: mobile menu, empty required-field validation, full six-step quote review and successful persisted submission, project category filtering, lightbox open/Escape close, FAQ exclusive expansion, browser back/forward.
- Homepage plus 15 additional page types checked for horizontal overflow at 320, 375, 430, 768, 1024, 1440 and 1920 pixels. No overflow detected. Quote confirmation also checked at all seven widths.
- Desktop and mobile screenshots reviewed. Browser console inspection returned no errors or warnings. Homepage image inspection found no broken completed image loads.
- Local-only synthetic records used. Integration-created enquiries and attachments were deleted by the tests. Test job/settings tombstones and audit records remain only in local storage; they are not shipped. A browser test quote remains in local storage with a clearly synthetic name and `.invalid` email.

## Limits and configuration

This is not a formal accessibility, penetration, load or legal-compliance audit. Keyboard Escape was verified for the native lightbox; focus indicators, labels, semantic landmarks and reduced-motion styles are implemented, but full assistive-technology testing is pending.

The hosted administrator allowlist is deliberately empty until the owner configures actual Site-specific user IDs. The local test identity is never part of production configuration. Optional email delivery was not tested because provider credentials and verified recipient/sender details were not supplied. Notification failures leave the saved enquiry intact. Production email delivery, genuine company details, full-resolution original logo and legal approval remain launch prerequisites.

File validation checks size, MIME and signature; malware scanning is not integrated. Uploaded PDFs are private, administrator-only downloads. Published media accepts JPEG/PNG only.

## Rerun

1. Apply local migrations and set ignored `.dev.vars` to `ADMIN_USER_IDS=local_seedy` for the starter's localhost-only identity.
2. Start `npm run dev -- --host 127.0.0.1`.
3. Run `node tests/integration.mjs` from the project directory.
4. Remove the temporary local allowlist when finished. The suite refuses non-localhost targets.

## Vercel compatibility verification

- `npm run build:vercel`: passed; generated `.next/routes-manifest.json`.
- `npm run build`: existing Vinext/Cloudflare build passed.
- Production Next.js HTTP checks: `/`, `/team`, `/services`, `/services/electrical-works`, and `/sitemap.xml` returned 200.
- Forged Sites identity headers on `/api/admin` returned 403.
- Same-origin enquiry request without storage returned an explicit 503, not a false success.
- Vercel cloud deployment must complete in the connected Vercel project; these checks verify local production output and responses.
