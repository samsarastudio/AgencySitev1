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


## Repair an existing deployment

On the Pi, in the actual app directory:

```sh
git pull --ff-only
npm ci
npm run admin:setup -- --origin https://inmomentservices.com
npm run build
```

Restart the existing service/container, then run `npm run blog:check`. Setup repairs missing credentials and preserves existing valid admin credentials and the existing bot key. If a password was generated it is saved to `.admin-login.txt`. If a bot key was missing it is generated in `.env.local`; privately configure the automation with that value. Do not paste keys into chat.

The check calls authenticated `GET /api/bot/posts`, verifies the running app can read and atomically write its post storage, and does not publish a post. A 401 from an invalid key alone is not a publishing test. Run the check with the same environment/key the automation uses as well.

For Docker, mount the environment/data into the running container; changing a host `.env.local` does not update an already-built image automatically. For systemd/PM2, confirm the working directory and environment used by the service. Explicit service environment variables override `.env.local`, including stale or blank values. Restart/recreate the service after changing those values. Do not use `admin:setup -- --reset` unless you intend to change the admin password.

The public admin screen shows only sign-in and generic errors. Deployment guidance belongs here, never on the public page.


### Existing FrameFlix-style PM2 deployment

FrameFlix's `ecosystem.config.cjs` loads `.env` into the PM2 environment and uses a different application root. InMoment's setup writes `.env.local` in **AgencySitev1's own directory**, which Next.js loads at runtime. Do not run setup inside the FrameFlix checkout or restart the FrameFlix process to deploy InMoment. Use `pm2 list` to identify the existing InMoment process, then restart that process after rebuilding. If its ecosystem file explicitly supplies admin or bot variables, update those values there as well; PM2's injected environment overrides the file. Do not copy or expose secrets from FrameFlix's repository/application.
