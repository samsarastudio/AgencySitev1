import { randomBytes, scryptSync } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
const target = ".env.local";
let existing = "";
try {
  existing = await readFile(target, "utf8");
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
if (
  /^ADMIN_PASSWORD_HASH=.+$/m.test(existing) &&
  !process.argv.includes("--reset")
) {
  console.log(
    "Admin already configured. Use npm run admin:setup -- --reset to rotate the password and invalidate sessions.",
  );
  process.exit(0);
}
let origin = process.env.ADMIN_ORIGIN || "";
if (!process.argv.includes("--local")) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  origin = await rl.question(
    "Exact website origin (e.g. https://inmomentservices.com): ",
  );
  rl.close();
  const url = new URL(origin);
  if (url.origin !== origin || url.protocol !== "https:")
    throw new Error("Use an HTTPS origin with no trailing slash or path.");
}
const password = randomBytes(24).toString("base64url"),
  salt = randomBytes(16).toString("hex"),
  hash = scryptSync(password, salt, 64).toString("hex");
const values = {
  ADMIN_PASSWORD_HASH: salt + ":" + hash,
  ADMIN_SESSION_SECRET: randomBytes(48).toString("hex"),
  ...(origin ? { ADMIN_ORIGIN: origin } : {}),
};
for (const [key, value] of Object.entries(values)) {
  const line = key + "=" + value;
  const pattern = new RegExp("^" + key + "=.*$", "m");
  existing = pattern.test(existing)
    ? existing.replace(pattern, line)
    : existing.trimEnd() + "\n" + line + "\n";
}
await writeFile(target, existing, { mode: 0o600 });
await writeFile(
  ".admin-login.txt",
  "InMoment blog editor\nURL: " +
    (origin || "http://127.0.0.1:3000") +
    "/admin\nPassword: " +
    password +
    "\n\nStore this password in your password manager, then remove this file. Restart the app after setup.\n",
  { mode: 0o600 },
);
console.log(
  "Admin configured. Your generated password is in .admin-login.txt (gitignored). Restart the app.",
);
