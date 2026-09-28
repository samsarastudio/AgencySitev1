import type { CollectionConfig } from "payload";
import { staff } from "./Users";
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    useAsTitle: "name",
    group: "Inquiries",
    defaultColumns: ["name", "email", "type", "status", "receivedAt"],
  },
  access: { create: staff, read: staff, update: staff, delete: staff },
  fields: [
    {
      name: "submissionId",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    ...[
      "company",
      "type",
      "date",
      "location",
      "audience",
      "budget",
      "package",
      "service",
      "colour",
    ].map((name) => ({ name, type: "text" as const })),
    { name: "message", type: "textarea", required: true },
    { name: "consent", type: "checkbox", required: true },
    {
      name: "receivedAt",
      type: "date",
      required: true,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "contacted", "closed"],
      admin: { position: "sidebar" },
    },
    { name: "notes", type: "textarea" },
    { name: "campaign", type: "json", admin: { readOnly: true } },
  ],
};
