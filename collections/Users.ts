import type { CollectionConfig, Access } from "payload";
export const staff: Access = ({ req }) => Boolean(req.user);
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Administration" },
  auth: {
    maxLoginAttempts: 10,
    lockTime: 600000,
    cookies: {
      sameSite: "Lax",
      secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https:"),
    },
  },
  access: { create: staff, read: staff, update: staff, delete: staff },
  fields: [{ name: "name", type: "text" }],
};
