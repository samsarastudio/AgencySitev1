import { createHash } from "node:crypto";
import { inquirySchema, type Inquiry } from "./inquiry";
import { getCMS } from "./cms";
export type { SavedInquiry } from "./legacy-inquiry-store";
export async function saveInquiry(input: Inquiry) {
  const { website, startedAt, ...data } = inquirySchema.parse(input);
  const submissionId = createHash("sha256")
    .update(JSON.stringify({ startedAt, data }))
    .digest("hex");
  const cms = await getCMS();
  const existing = (
    await cms.find({
      collection: "enquiries",
      where: { submissionId: { equals: submissionId } },
      limit: 1,
      overrideAccess: true,
    })
  ).docs[0];
  if (existing) return existing;
  try {
    return await cms.create({
      collection: "enquiries",
      data: {
        ...data,
        submissionId,
        receivedAt: new Date().toISOString(),
        status: "new",
      },
      overrideAccess: true,
    });
  } catch (error) {
    const raced = (
      await cms.find({
        collection: "enquiries",
        where: { submissionId: { equals: submissionId } },
        limit: 1,
        overrideAccess: true,
      })
    ).docs[0];
    if (raced) return raced;
    throw error;
  }
}
