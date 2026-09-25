import env from "@next/env";
env.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const origin = process.env.ADMIN_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
if (!origin || !process.env.OPENCLAW_API_KEY) {
  console.error(
    "Missing site origin or OPENCLAW_API_KEY in this process. Run admin:setup or configure the service environment.",
  );
  process.exit(1);
}
const url = new URL(origin);
if (
  url.protocol !== "https:" &&
  !["localhost", "127.0.0.1"].includes(url.hostname)
)
  throw new Error("Use HTTPS for the public endpoint.");
if (url.hostname !== process.env.BOT_API_HOST) {
  console.error(
    "BOT_API_HOST does not match the configured site origin. Correct the deployment environment before testing.",
  );
  process.exit(1);
}
try {
  const r = await fetch(new URL("/api/bot/posts", url), {
    headers: { Authorization: "Bearer " + process.env.OPENCLAW_API_KEY },
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
  });
  const data = await r.json().catch(() => null);
  if (r.ok && data?.ok && data.storage === "writable")
    console.log(
      "PASS: live hostname, bot authentication and persistent storage verified. No post was published.",
    );
  else {
    const hints = {
      401: "The running app and this caller do not have the same API key.",
      403: "Check Cloudflare Access/WAF rules for this server-to-server request.",
      404: "Check BOT_API_HOST and the tunnel Host header.",
      405: "Deploy the updated API and restart the service.",
      503: "The running service is missing configuration or cannot use blog storage.",
    };
    console.error(
      `FAIL: HTTP ${r.status}. ${hints[r.status] || "Check the server logs and deployment URL."}`,
    );
    process.exitCode = 1;
  }
} catch {
  console.error(
    "Could not reach the live endpoint. Check DNS, tunnel and service availability.",
  );
  process.exitCode = 1;
}
