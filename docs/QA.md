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
