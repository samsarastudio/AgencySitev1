import { getPayload } from "payload";
export async function getCMS() {
  const { default: config } = await import("../payload.config");
  return getPayload({ config });
}
