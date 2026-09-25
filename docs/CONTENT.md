# Content editing

## Experience studies

Edit `content/work.ts`. Each study has a stable slug, title, summary, categories, status, optional image, brief, challenge, guest flow, technologies, production considerations and related service slugs. Optional `results` render only when supplied. `visibility: "draft"` excludes a record from routes, sitemap, filters and related links.

Use `Experience design · Proposed scope`, `Draft estimate`, `Final software scope` or another accurate status. An approved scope, target date or estimate is not proof of deployment. Never turn anticipated participant counts into results. Do not add brand names, agency names, campaign trademarks, source filenames, prices, hours or confidential contacts. Publication of a named client requires the owner's explicit authorization.

Generated images are visibly labeled “Concept visualization.” Preserve that caption and factual alt text. The old FrameFlix images are labeled product imagery because the live disclaimer describes site imagery as illustrative. Do not relabel them as verified client-event photographs.

## Articles

Use `/admin` for live writing, publishing and cover uploads, or the [bot API](BOT-API.md) for automated posts. See [Pi setup and backups](BLOG-ADMIN.md). Server-stored edits override starter articles and persist independently of Git.

For source-controlled starter content, edit `content/articles.ts`. Required fields include slug, title, description, category, tags, author, publication date, image and sections. Optional `updated` preserves editorial revision dates; `draft: true` excludes the article everywhere. Add sections with heading, paragraphs and optional list items. Reading time, table of contents, tags, related articles, previous/next, RSS and sitemap are generated.

Six evergreen identities retain their historical publication dates with an explicit update date. Unsupported lifespan, inkjet comparison, attendance and participation statistics were removed. Repetitive trend articles consolidate to relevant planning guides through the redirect map. Raw originals remain in the separate research archive.

Use original, grounded copy. Source any empirical claims before publication. Do not invent authors, quotes, project results or testimonials. An organization editorial byline is supported; fake staff biographies are not.

## Services and local pages

Edit `content/services.ts` for service copy and `content/pages.ts` for local/event and editorial pages. Slugs generate routes and sitemap entries. City routes remain at their established URLs. Local claims are limited to the verified service area; no invented offices or addresses. Additional blog migration routes live in `content/redirects.json`.

## Navigation and backtracking

Work and Insights filters use query parameters. Work cards carry a validated `from` URL so explicit Back links return to the filtered index. Browser Back/Forward restores filter state. Search replaces query state rather than creating a history entry for every keystroke. Filter changes preserve unrelated UTM query parameters. Breadcrumbs link to parent pages; logo links return home. Legal links within the inquiry form open a new tab to avoid losing an unfinished brief.

## Marketing events

`lib/analytics.ts` provides `configureAnalytics(adapter)` and a consent-gated `track` function. No external analytics provider is active by default. Optional consent is controlled through footer Cookie preferences. Register your adapter inside a small client initializer after selecting a provider. Do not install ad trackers or transmit analytics before consent.

Events: page_view, start_project, send_brief, email_click, case_study_view, service_engagement, photo_quote, capabilities_visit, campaign_landing_visit, blog_cta, form_started, form_completed. UTM fields are retained in memory for the current navigation session. Form text, email, names and other inquiry contents are excluded from analytics events.

## Campaign landing pages

Compose a new server page from PageHero, WorkCard, SectionHead, Button and Cta. Select the relevant service and studies. Add a unique metadata call and include the route in `lib/routes.ts`. Use the existing Start Project action and preserve query parameters through any filter changes. Do not fabricate case results to support a campaign.

## Legal

The former privacy and disclaimer routes are retained. Privacy wording was aligned to agency inquiries and opt-in analytics. Original policy snapshots are in the separate research archive. The owner should review the expanded policy and actual provider/data-retention arrangements before a public production cutover. No new insurance, compliance, certification or legal guarantees were invented.
