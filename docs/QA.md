# QA record

Date: 2026-09-25.

- Production Next.js build generated 49 content routes plus APIs, error and metadata endpoints.
- Route crawl: all 49 pages returned 200 with one H1, title, description and canonical; no broken internal page targets or confidential client/agency names found. Initial cold dev compilation produced transient manifest errors on four first-hit dynamic paths; repeat crawl passed, and production build passed.
- Twelve meaningful tests passed: required fields, email, consent, length, submission timing, server validation, origin rejection, honeypot, request size, rate limit, unconfigured delivery and mocked provider responses.
- Browser: desktop homepage, 390px mobile homepage, mobile menu, form validation and email-draft fallback, Work category filtering and explicit return to its filtered index, article search.
- Production route crawl also passed all 49 pages. Tablet photo overview (768px), mobile AI case study (390px), search empty state/reset and gallery browser-back filter restoration were checked. No horizontal overflow was observed on those responsive pages.
- Dependency audit after updates: zero reported vulnerabilities.
- No real inquiry email or newsletter subscription was sent. Provider success was mocked in tests.

## Limits

WCAG 2.2 AA is the implementation target, not an external certification. Semantic navigation, visible focus, labels/errors, skip link, alt text, contrast-conscious tokens and reduced motion are built in. A full assistive-technology audit and field Core Web Vitals measurement require deployed real-user conditions and are not claimed here. The private static preview cannot validate server-backed provider delivery. Domain cutover is not part of the completed preview.

## Copy and image update — September 25

Warmer copy across the site; motto preserved. Five coherent InMoment installation concept images replace the older visual set. In-car concept removed from public content and assets. Production build and all 48 current content routes pass; image references resolve. Mobile 390px kiosk detail and five-item work index visually checked. Existing form logic is unchanged.


## Pi blog system validation (2026-09-25)

Production build and 23 automated tests passed. Tests cover API hostname/key checks, slug upserts and stable IDs, Lexical input, draft/future visibility, optimistic edit conflicts and returned revision reuse, session checks, upload/path restrictions, rate limits and safe Markdown rendering. Browser verification on an isolated local production server confirmed sign-in, draft creation with multiple tags, persistence after restart, publish and public article rendering, then unpublish and a public not-found page. No test posts were sent to FrameFlix or the live Pi. Pi installation, Cloudflare settings and live secrets remain deployment steps.

## Enquiry inbox (2026-09-27)

28 automated tests and the production build pass. An isolated local production server was verified in the browser: submit contact form, see confirmation without opening email, sign into admin, select Enquiries, and read the stored name/email/message. Tests verify unauthenticated inbox requests return 401, authenticated responses disable caching, retries do not duplicate records, and storage failures return an error. No live enquiries or emails were sent during verification. Pi deployment still requires pulling, rebuilding and restarting its existing InMoment service.


## Payload migration validation (September 27, 2026)

- Production Next/Payload build passed. Native admin uses a separate root layout.
- Disposable SQLite database: committed migration applied successfully; native email/password login returned a session token.
- Bot create/upsert and native rich-text conversion passed; draft and future publication visibility checked.
- Enquiry submission persisted once across a retry; anonymous reads/writes denied, staff status/notes updates passed.
- Legacy import trial imported all 11 seed articles; a second run imported zero records. Original sources preserved.
- Local browser verification was blocked by automatic tool approval rejecting test-server startup. Live Pi deployment and valid-key automation remain unverified because Pi access/secrets were not available.
- Dependency audit: no high/critical findings. Five moderate entries trace to the SQLite migration tool's transitive esbuild development-server dependency; no registry fix available. Do not expose migration tooling as a server.
