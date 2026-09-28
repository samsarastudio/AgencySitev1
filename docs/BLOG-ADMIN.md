# Payload admin on your Pi

InMoment now uses the same framework as FrameFlix: Payload CMS 3, SQLite and the Lexical rich-text editor. Its database, users and API key are separate from FrameFlix. The marketing header/footer are not part of the admin.

## One-time migration

Stop only the InMoment application before upgrading. Back up `.env.local`, the entire legacy `data/blog` folder (or `BLOG_DATA_DIR`), any separate `INQUIRY_DATA_DIR`, and any existing CMS database/media. Keep the Cloudflare route unavailable until setup has created the first administrator; do not expose an empty Payload installation.

Use Node 24 LTS on the Pi. In the AgencySitev1 checkout:

```sh
git pull --ff-only
npm ci
npm run cms:setup -- --origin https://inmomentservices.com --email YOUR_ADMIN_EMAIL
npm run cms:import
npm run build
```

`cms:setup` preserves existing configured secrets, creates missing ones in `.env.local`, runs committed database migrations, and creates an email/password Payload account. A new account's credentials are written to `.admin-login.txt` with owner-only permissions. Save them in your password manager and remove that file. Re-running setup preserves an existing account; it does not reset its password.

`cms:import` adds existing filesystem posts, seed articles and saved enquiries, skipping records already in Payload. It does not delete original files or overwrite CMS edits. Keep legacy blog media on disk: old cover URLs still use `/api/blog-media/...`. New uploads use Payload Media. Old custom-admin passwords/cookies do not sign into Payload.

Restart your existing InMoment process with its updated environment. Its working directory must be this checkout so relative database paths and `.env.local` resolve correctly. If PM2/systemd explicitly injects environment variables, update those values too; process environment takes precedence over `.env.local`. Do not restart or repoint FrameFlix.

## Use the admin

Open `https://inmomentservices.com/admin` and sign in with the Payload account:

- **Posts:** edit rich text, upload/select a featured image, set title, excerpt, SEO description, category and tags. Save as draft or published. Future publication dates stay hidden until due. Changes are read live without rebuilding.
- **Enquiries:** read contact/quote requests, filter by status, mark contacted/closed and keep internal notes.
- **Media:** manage uploaded images and alternative text.
- **Users:** manage staff accounts and passwords. All users in this small-site setup are trusted administrators.

No enquiry email service is used. Password reset email also requires an email adapter; without one, use another administrator to change a user's password. Store your generated credentials safely.

## Persistent storage and backup

`DATABASE_URI` defaults to `file:./data/cms/inmoment.db`. `CMS_MEDIA_DIR` defaults to `./data/cms/media`. Prefer absolute persistent paths on the Pi, create their parent directories, and give only the application user write access. Never place the database under `public`.

Back up the SQLite database and media together while the InMoment process is stopped, or use SQLite's online backup facility. Do not copy only the main database file during active writes. Retain legacy media and import source backups until migration is confirmed. Run one InMoment Node process with this SQLite setup.

For subsequent schema changes, run `npm run cms:migrate` before restarting the updated app. Production automatic schema push is disabled. `CMS_SCHEMA_PUSH` is for disposable development databases only and must remain unset on the Pi.

## Automation verification

Set the automation's URL to `https://inmomentservices.com/api/bot/posts` and its bearer secret to this site's `OPENCLAW_API_KEY`. Run `npm run blog:check` on the Pi to check authenticated access and database reads. A 401 for an invalid key does not prove publishing works. Verify a draft POST with the valid key and open it in Posts. See [API contract](BOT-API.md).

Cloudflare must preserve the original Host header, allow authenticated bot POSTs, and bypass caching on `/admin*` and `/api/*`. If you add Cloudflare Access, provide an appropriate service-token policy for the automation. Set `TRUST_CLOUDFLARE=true` only if the origin is reachable solely through the trusted tunnel.
