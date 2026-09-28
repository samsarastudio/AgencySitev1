import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { resolve } from "node:path";
import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Enquiries } from "./collections/Enquiries";
import { Media } from "./collections/Media";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";
export default buildConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: " | InMoment Admin", robots: { index: false, follow: false } },
    importMap: { baseDir: resolve(/* turbopackIgnore: true */ process.cwd()) },
  },
  collections: [Users, Enquiries, Posts, Media],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || process.env.ADMIN_SESSION_SECRET || "",
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || "file:./data/cms/inmoment.db" },
    push: process.env.CMS_SCHEMA_PUSH === "1",
    migrationDir: resolve("migrations"),
  }),
  graphQL: { disable: true },
  typescript: { outputFile: resolve("payload-types.ts") },
  csrf: [origin],
  cors: [origin],
  upload: { limits: { fileSize: 8 * 1024 * 1024 } },
});
