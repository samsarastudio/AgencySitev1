# InMoment Services

A production Next.js 16.3.6 / React 19.3 / TypeScript agency website focused on AI photobooths, personalized photo experiences and connected event technology. AR and interactive installations are supporting capabilities.

## Run locally

Use Node 20.19+ (Node 24 LTS recommended).

```sh
npm ci
npm run cms:setup -- --origin http://127.0.0.1:3000 --email admin@example.com
npm run cms:import
npm run dev
```

Open http://127.0.0.1:3000. For production: `npm run build` then `npm start`.

## What is included

48 content pages: homepage, five anonymized experience studies, six service pages, FrameFlix overview and product/package/gallery pages, eight preserved local/event pages, eleven articles, agency/about/capabilities pages, inquiry and quote forms, newsletter boundary, FAQ and retained legal content. Includes generated concept imagery, a clean vector production logo based on a generated interlocking-frame direction, responsive layouts, URL-based filters and search, breadcrumbs, explicit return links, sitemap, robots, RSS, article/service/organization/breadcrumb schema, and 68 permanent blog redirects.

The existing FrameFlix site is linked at https://frameflix.inmomentservices.com. No changes were made to its domain or the current inmomentservices.com deployment.

## Blog publishing

Native Payload CMS is available at `/admin`, using SQLite, email/password staff accounts, Lexical rich text, Media uploads, draft/published posts, publication dates and an Enquiries inbox. See [Pi blog setup](docs/BLOG-ADMIN.md) and the [compatible bot API](docs/BOT-API.md) for `POST /api/bot/posts`. Live posts update without rebuilding.

## Content and evidence

Content lives in `content/` independently of components. See [Content guide](docs/CONTENT.md). Internal document extracts, client names and commercial details are deliberately outside this repository in the sibling `research` folder. Do not move that folder into `public`, commit it, or include it in hosting archives.

Case studies describe documented experience designs and scope. They do not assert deployment, measured results or named-client endorsement. The owner confirmed InMoment delivered through another agency and directed the site to use the documents as capability references without naming that agency.

## Forms and integrations

Copy `.env.example` to `.env.local` for local configuration. Server-side secrets must never use `NEXT_PUBLIC_` names.

Contact and quote submissions are saved on the Pi and viewed in `/admin` → **Enquiries**. Visitors receive an on-page confirmation only after storage succeeds. No email provider, webhook or public enable flag is required. Replies are handled separately using the contact details in the inbox. See [enquiry inbox setup](docs/ENQUIRIES.md).

- `DATABASE_URI`, `CMS_MEDIA_DIR`: persistent Payload SQLite database and uploaded media.
- `NEWSLETTER_WEBHOOK_URL`, `FORM_WEBHOOK_TOKEN`, `NEXT_PUBLIC_NEWSLETTER_ENABLED`: separate newsletter integration.
- `NEXT_PUBLIC_SITE_URL`: canonical production origin and expected form origin.

No enquiry emails are sent. Public APIs cannot list enquiries; the inbox requires an admin session. No personal form contents are sent to analytics.

Server validation, input length bounds, origin checks, honeypot, minimum elapsed time and a process-local request limit are implemented. For multi-instance public operation, enforce a shared rate limit at your ingress/provider and confirm trusted forwarding headers. The process-local limiter is not a distributed quota.

## Review deployment versus production

`npm run build:preview` generates a private static review export under `out/`, with noindex and the email-draft fallback. The script temporarily moves server API routes out of the export and restores them in `finally`. Never use this export as the configured server-backed production deployment.

`npm run build` builds the complete Next.js server including API routes and native permanent redirects. See [Deployment guide](docs/DEPLOYMENT.md) for the domain cutover and integration checks. Static review pages contain `_redirects` for compatible hosts; the canonical production redirect implementation is `next.config.ts`.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

Tests cover malformed submissions, missing consent, length limits, timing, honeypot, cross-origin requests, rate limits, unconfigured delivery, and mocked provider failure/success. See [QA notes](docs/QA.md) for browser and route verification and the remaining external dependencies.

## Design

Charcoal #171716, warm white #f3f1ec and orange #ff754d. Space Grotesk headings and Inter body are self-hosted by Next.js font optimization. Shared CSS tokens, responsive layout rules and reduced-motion support live in `app/(frontend)/globals.css`. Images use `next/image`, local WebP assets, reserved ratios and lazy loading except key hero images. No autoplay video or heavy 3D runtime.
