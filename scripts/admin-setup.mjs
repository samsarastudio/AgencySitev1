import { randomBytes, scryptSync } from "node:crypto";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import env from "@next/env";
const target = ".env.local";
let existing = "";
try {
  existing = await readFile(target, "utf8");
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
env.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const args = process.argv.slice(2);
const local = args.includes("--local");
const reset = args.includes("--reset");
const originIndex = args.indexOf("--origin");
let origin =
  originIndex >= 0 ? args[originIndex + 1] : process.env.ADMIN_ORIGIN;
if (originIndex >= 0 && (!origin || origin.startsWith("--")))
  throw new Error("--origin requires an HTTPS origin.");
if (local) origin = "http://127.0.0.1:3000";
if (!origin) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  origin = await rl.question("Exact public HTTPS website origin: ");
  rl.close();
}
const url = new URL(origin);
if (url.origin !== origin || (!local && url.protocol !== "https:"))
  throw new Error("Use an HTTPS origin without a trailing slash or path.");
const values = { ADMIN_ORIGIN: origin };
let password;
if (
  reset ||
  !/^[a-f0-9]+:[a-f0-9]{128}$/i.test(process.env.ADMIN_PASSWORD_HASH || "")
) {
  password = randomBytes(24).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  values.ADMIN_PASSWORD_HASH =
    salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
if (reset || (process.env.ADMIN_SESSION_SECRET || "").length < 32)
  values.ADMIN_SESSION_SECRET = randomBytes(48).toString("hex");
// Never rotate a configured bot key as a side effect of repairing the editor.
if (!process.env.OPENCLAW_API_KEY)
  values.OPENCLAW_API_KEY = randomBytes(32).toString("hex");
if (!process.env.BOT_API_HOST) values.BOT_API_HOST = url.hostname;
for (const [key, value] of Object.entries(values)) {
  const line = key + "=" + value;
  const pattern = new RegExp("^" + key + "=.*$", "m");
  existing = pattern.test(existing)
    ? existing.replace(pattern, line)
    : existing.trimEnd() + "\n" + line + "\n";
}
await writeFile(target, existing, { mode: 0o600 });
await chmod(target, 0o600);
if (password) {
  await writeFile(
    ".admin-login.txt",
    `InMoment blog editor\nURL: ${origin}/admin\nPassword: ${password}\n\nStore this in your password manager, then delete this file.\n`,
    { mode: 0o600 },
  );
  await chmod(".admin-login.txt", 0o600);
}
console.log(
  password
    ? "Admin password saved to .admin-login.txt (gitignored)."
    : "Existing admin password preserved.",
);
console.log(
  values.OPENCLAW_API_KEY
    ? "Bot key created in .env.local. Configure your automation with that key privately."
    : "Existing bot key preserved.",
);
console.log(
  "Configuration saved. Restart the deployed app, then run npm run blog:check. No secrets were printed.",
);
