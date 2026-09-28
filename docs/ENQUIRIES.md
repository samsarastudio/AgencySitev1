# Enquiry inbox

Contact and quote forms POST to `/api/inquiry`. The server validates the request and saves it into the private Payload **Enquiries** collection. A visitor sees confirmation only after successful storage. No mail app opens, and no Resend key or email delivery is required.

Sign into `/admin`, choose Enquiries, and open a record to see the brief and contact information. Use status (new/contacted/closed) and internal notes to track follow-up. Search/filter and deletion use native Payload controls. Access requires a staff account; anonymous collection reads and writes are denied. The public submission endpoint allows validated creation only.

Set up and migrate the Pi using [Payload admin setup](BLOG-ADMIN.md). Old filesystem enquiries are imported by `npm run cms:import` without deleting source files. New enquiries share the CMS SQLite database; `INQUIRY_DATA_DIR` is only a legacy import source now.

Back up the database and limit access to staff. Delete enquiries when no longer needed under your retention policy. Replies are handled separately using the submitted contact details. Newsletter signup remains a separate optional provider integration.
