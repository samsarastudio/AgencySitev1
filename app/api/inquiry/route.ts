import { handleSubmission } from "@/lib/submit";
export async function POST(request: Request) {
  return handleSubmission(request, "inquiry");
}
