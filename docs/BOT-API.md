# Bot publishing API

This InMoment implementation follows the supplied FrameFlix request and response structure. It does not call or modify the existing FrameFlix service. Configure `BOT_API_HOST` to the hostname serving this application and `OPENCLAW_API_KEY` to a secret of at least 32 characters. Restart after configuration changes.

```http
POST https://YOUR-HOST/api/bot/posts
Content-Type: application/json
Authorization: Bearer <OPENCLAW_API_KEY>
```

```json
{
  "title": "Example Blog Title",
  "slug": "example-blog-title",
  "excerpt": "Short summary for cards and SEO.",
  "content": "# Heading\n\nMarkdown blog content here.",
  "status": "published",
  "publishedAt": "2026-09-25T19:00:00.000Z",
  "category": "trends",
  "tags": ["photo booth", "events", "2026"],
  "author": "FrameFlix Team",
  "metaDescription": "SEO description, maximum 160 characters."
}
```

Required: `title` and either `content` (Markdown) or `contentLexical` (Payload-style Lexical JSON with a `root`). If both are supplied, Markdown takes precedence. Status defaults to `published`, category to `tips`, tags to an empty list and author to `FrameFlix Team`. Send `InMoment Team` explicitly when appropriate. Categories are `tips`, `events`, `studio`, `trends`; status is `published` or `draft`.

The slug is generated from the title when omitted. Provide a fixed slug when updating or changing a title. An existing slug updates that post, preserving its numeric ID. Publication time defaults to now for a new post and retains the existing time on updates; future posts remain hidden until that instant. Omitted excerpt and SEO description retain existing values on updates. Omitted status/category/tags/author apply the defaults above. Cover images can be changed in `/admin`.

A created post returns HTTP 201, an update HTTP 200:

```json
{"ok": true, "id": 87, "slug": "example-blog-title", "action": "created"}
```

IDs are stable numeric identifiers, not sequential counters. `action` is `created` or `updated`. Errors return `{ "ok": false, "error": "..." }`, with field details for validation failures. Codes include 400 validation, 401 key, 404 wrong host, 413 size, 415 content type, 422 unsupported rich text, 429 quota (with Retry-After), and 503 missing configuration.

Requests are limited to 10/minute per trusted client IP. Enable the Cloudflare setting as described in [Pi setup](BLOG-ADMIN.md); otherwise a shared bucket is used. Limit state resets on process restart. Body limit: 200 KB; Markdown: 100,000 characters; title: 160; excerpt: 320; SEO description: 160; tags: 15. Slugs use lowercase ASCII words/numbers separated by hyphens, at most 100 characters.

Markdown is retained for rendering and converted to a Payload-style Lexical representation on save. This is a filesystem CMS, not a Payload installation. Standard paragraphs, headings, bold/italic, lists, links, quotes, breaks and code are supported for Lexical input. Custom Payload blocks/uploads are rejected with 422; send Markdown for those posts. Images in the stored Lexical representation become links. Arbitrary Payload plugins are not supported.

Use a separate bot key for each independently deployed website. Keep it only in server/bot configuration, never in browser code or committed request examples.
