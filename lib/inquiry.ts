import { z } from "zod";
const short = z.string().trim().max(200).optional().default("");
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(254),
  company: short,
  type: short,
  date: short,
  location: short,
  audience: short,
  budget: short,
  package: short,
  service: short,
  colour: short,
  message: z
    .string()
    .trim()
    .min(20, "Please share at least 20 characters about your project.")
    .max(6000, "Please keep your brief under 6,000 characters."),
  consent: z.literal(true, {
    error: "Please consent to being contacted about your inquiry.",
  }),
  website: z.string().max(300).optional().default(""),
  startedAt: z.number().finite(),
  campaign: z.record(z.string(), z.string().max(200)).optional(),
});
export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address.").max(254),
  consent: z.literal(true, {
    error: "Please consent to receive the newsletter.",
  }),
  website: z.string().max(300).optional().default(""),
  startedAt: z.number().finite(),
});
export type Inquiry = z.infer<typeof inquirySchema>;
export function validateTiming(startedAt: number, now = Date.now()) {
  return startedAt <= now - 2000 && startedAt >= now - 86_400_000;
}
