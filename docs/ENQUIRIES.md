# Private enquiry inbox

Contact and quote forms submit to `/api/inquiry` and save on the Pi. Visitors stay on the website and see confirmation only after a successful save. No Resend key or mail application is needed, and no enquiry email or webhook is sent.

Sign in at `/admin`. **Enquiries** opens by default. Select a submission to read its message, contact details, event preferences, budget, receipt time and consent. Search by name, email, company or message; use **Refresh enquiries** for new submissions. **Blog posts** opens the existing editor. The enquiry list is accessible only with a valid admin session.

## Deploy on the Pi

In the existing InMoment checkout, run `git pull --ff-only`, `npm ci`, and `npm run build`, then restart the InMoment service. If admin credentials are not configured, run `npm run admin:setup -- --origin https://inmomentservices.com` first. Keep the generated password privately.

The default enquiry directory is `inquiries` inside `BLOG_DATA_DIR`, or `data/blog/inquiries` if no blog path is set. This is outside public assets and ignored by Git. An optional `INQUIRY_DATA_DIR` overrides it with a dedicated absolute path. The app's OS account must have read/write access. Mount this path persistently when using Docker and include it in backups. Source updates do not replace these records. Run one app process against this filesystem store.

No `NEXT_PUBLIC_FORMS_ENABLED`, `INQUIRY_WEBHOOK_URL` or `RESEND_API_KEY` is used for enquiries. Newsletter subscriptions remain separate. Static review exports still offer an email draft because they do not have a server API; deploy the full Node server for the inbox.

## Verify and retain

Submit a labeled test enquiry, confirm the on-page acknowledgement, then sign into `/admin` and locate the same details under Enquiries. Confirm it remains after a service restart. Storage failures return an error and leave the form filled. Retrying identical content from the same form session does not create duplicates.

Records contain personal contact details and messages. Restrict filesystem access and backups to the website operator. Keep records only as long as needed; this initial inbox does not provide deletion or automatic retention controls. Do not put the data directory under `public/` or commit it.
