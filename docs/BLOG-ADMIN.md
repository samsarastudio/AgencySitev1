# Blog editor on the Raspberry Pi

The Node server includes `/admin`. Sign in, choose a post or select **New post**, write Markdown, preview, upload a cover, then publish. **Save draft** hides the post; a future publication date schedules it in UTC. Published edits appear immediately in Insights, homepage teasers, RSS and the sitemap without rebuilding. Existing URLs stay fixed after the first save. Concurrent edits return a conflict instead of overwriting newer content.

## First deployment

Use a 64-bit Pi OS with Node 24 and one app process. In your existing website checkout:

```sh
git pull --ff-only
npm ci
npm run admin:setup
```

Enter your website's exact public HTTPS origin, without a trailing slash. The command preserves other `.env.local` values and creates an admin password hash and session secret. Read `.admin-login.txt` locally, store the password in your password manager, then delete that file. It is ignored by Git. To reset a password and invalidate sessions, run `npm run admin:setup -- --reset` and restart the app.

Set these in `.env.local` before building:

```dotenv
NEXT_PUBLIC_SITE_URL=https://inmomentservices.com
ADMIN_ORIGIN=https://inmomentservices.com
BLOG_DATA_DIR=/var/lib/inmoment/blog
BOT_API_HOST=inmomentservices.com
TRUST_CLOUDFLARE=true
```

Replace the domain with the actual hostname serving this application. Create the persistent directory and grant read/write access to the OS account running the app. Set `OPENCLAW_API_KEY` to a random secret of at least 32 characters if bot publishing is needed; it is independent of the admin password. Keep secrets out of Git and client-side variables.

```sh
npm run build
npm start
```

Restart your existing process manager/service with this build. `npm start` binds to `127.0.0.1:3000`; point your Cloudflare Tunnel at that address. Access `https://YOUR-HOST/admin`. This requires the full Next.js server; the static preview export cannot save posts.

`TRUST_CLOUDFLARE=true` enables per-IP limits using Cloudflare's connecting-IP header. Use it only with ingress restricted to the tunnel, keeping the origin port inaccessible from the public network. Without it, bot requests share one safe rate-limit bucket. The limiter and write serialization are process-local: run one app process against the data directory.

Do not apply a Cloudflare Cache Everything rule to `/`, `/admin`, `/api/*`, `/insights*`, `/rss.xml`, or `/sitemap.xml`. These pages need fresh server responses. Preserve the public Host header through the tunnel for hostname-scoped bot access.

## Storage and backup

Default storage is `data/blog` in the checkout. An absolute `BLOG_DATA_DIR` keeps content separate from deployment files. It contains `posts` (JSON), `media` (uploaded WebP), and `history` (previous versions). Back up this entire directory and the server environment separately. Git pushes contain application code and starter articles, not live edits or uploaded images. A fresh server without this data shows the starter articles.

Draft text is hidden from public queries. Uploaded images have public, unguessable URLs even when attached to a draft; do not upload confidential media. The editor accepts JPEG, PNG and WebP up to 8 MB, re-encodes them and removes metadata. History is retained on disk; there is no restore button yet.

For local development, run `npm run admin:setup -- --local` then `npm run dev`. The password is in `.admin-login.txt`. Production requires an explicit `ADMIN_ORIGIN`.
