import type { CollectionConfig } from "payload";
import { staff } from "./Users";
import { resolve } from "node:path";
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: { read: () => true, create: staff, update: staff, delete: staff },
  upload: {
    staticDir: resolve(
      /* turbopackIgnore: true */ process.env.CMS_MEDIA_DIR ||
        "./data/cms/media",
    ),
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    imageSizes: [{ name: "card", width: 900, height: 600, position: "centre" }],
  },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "caption", type: "text" },
  ],
};
