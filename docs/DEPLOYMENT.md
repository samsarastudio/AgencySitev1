# Production deployment

## Full Next.js server

1. Use a Node-capable host supporting Next.js 16.3.6. Install the locked dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_SITE_URL=https://inmomentservices.com`. Keep `NEXT_PUBLIC_PREVIEW=0` and leave `SITE_EXPORT` unset.
3. Configure the inquiry and newsletter webhooks and secret token. Test the delivery contract before enabling the corresponding `NEXT_PUBLIC_*_ENABLED` flag. Each webhook should return a 2xx only after accepting a durable delivery/subscription job. Handle mail failures, opt-in, retries and unsubscribe processing in the selected provider.
4. Run `npm run typecheck`, `npm test`, `npm run build`, then `npm start`. Public environment flags are build-time values; rebuild after changing them.
5. Verify a real inquiry and the newsletter confirmation workflow in a controlled staging environment. Do not run tests against real contacts.
6. Configure TLS, trusted reverse-proxy headers, shared ingress rate limiting, monitoring and log retention. Logs must not contain inquiry bodies or secrets. Consider a provider-backed challenge if abuse requires it.
7. Review article migration and privacy wording, then point the domain to the approved host. This task did not change DNS or replace the existing site.
8. Keep frameflix.inmomentservices.com linked. Its hosting and DNS remain independent.

## Redirects and search

The 68 blog redirects are defined in `content/redirects.json` and use Next.js permanent redirects (308, preserving query parameters). Current city, event, product, package, quote, gallery and legal URLs remain available. Verify representative redirects and query-string preservation after domain cutover. Submit the sitemap and review actual Search Console data when access is available; no traffic baseline was provided.

Sitemap: `/sitemap.xml`; robots: `/robots.txt`; RSS: `/rss.xml`. Canonicals use the configured origin. Work and article detail pages receive record-specific metadata. The private static review export is noindex and uses the production canonical origin; do not treat it as an SEO production launch.

## Static review export

Run `npm run build:preview`. It produces `out/` with all content pages and static assets. APIs are deliberately excluded and restored to the source afterwards; forms remain honest email-draft or unavailable states. `_redirects` and `_headers` are included for hosts that support those files. Static-only hosts do not provide the production image transformation service; the export uses locally compressed WebP assets.

If an interrupted process leaves `app/api` absent, restore `.preview-api/api` to `app/api` before a normal build. The normal script restores automatically even after a build failure.

## Remaining external setup

Email/CRM destination, newsletter provider, analytics adapter (if desired), approved public hosting credentials and DNS access, provider-specific privacy/retention details, and a public release decision. No fake email success, analytics dashboard, capabilities deck, client-logo wall, certificates or testimonials are present.
