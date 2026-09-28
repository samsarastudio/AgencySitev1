import type { CollectionConfig, Where } from "payload";
import { staff } from "./Users";
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "category", "status", "publishedAt"],
  },
  access: {
    create: staff,
    readVersions: staff,
    read: ({ req }) =>
      req.user
        ? true
        : ({
            and: [
              { status: { equals: "published" } },
              { publishedAt: { less_than_equal: new Date().toISOString() } },
            ],
          } as Where),
    update: staff,
    delete: staff,
  },
  versions: { maxPerDoc: 20 },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title)
          data.slug = String(data.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        if (data?.status === "published" && !data.publishedAt)
          data.publishedAt = new Date().toISOString();
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 160 },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) =>
        (typeof v === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) ||
        "Use lowercase words separated by hyphens.",
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 320 },
    { name: "content", type: "richText", required: true },
    { name: "featuredImage", type: "upload", relationTo: "media" },
    {
      name: "image",
      type: "text",
      defaultValue: "/images/ai-portrait-kiosk.webp",
      admin: {
        description:
          "Existing image path; upload a featured image above to replace it.",
      },
    },
    {
      name: "imageAlt",
      type: "text",
      defaultValue: "InMoment photo experience concept",
    },
    { name: "imageCaption", type: "text" },
    {
      name: "category",
      type: "text",
      required: true,
      defaultValue: "tips",
      admin: {
        position: "sidebar",
        description:
          "Bot categories: tips, events, studio, trends. Existing editorial categories are preserved.",
      },
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
      admin: { position: "sidebar" },
    },
    {
      name: "author",
      type: "text",
      defaultValue: "InMoment Team",
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: ["draft", "published"],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
    { name: "metaDescription", type: "textarea", maxLength: 160 },
    {
      name: "source",
      type: "select",
      defaultValue: "admin",
      options: ["admin", "openclaw", "import"],
      admin: { readOnly: true, position: "sidebar" },
    },
    { name: "legacyId", type: "number", index: true, admin: { hidden: true } },
  ],
};
