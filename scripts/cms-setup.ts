import env from "@next/env";
import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir, chmod } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
env.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const args = process.argv.slice(2);
const value = (name: string) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : args[i + 1];
};
let origin = value("--origin") || process.env.NEXT_PUBLIC_SITE_URL;
let email = value("--email");
if (!origin || !email) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  origin ||= await rl.question("Public HTTPS website origin: ");
  email ||= await rl.question("Admin email address: ");
  rl.close();
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  throw new Error("A valid admin email is required.");
const url = new URL(origin!);
if (
  url.origin !== origin ||
  (url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname))
)
  throw new Error("Use an HTTPS origin without a trailing slash.");
let text = "";
try {
  text = await readFile(".env.local", "utf8");
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
}
const vars: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: origin!,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || randomBytes(48).toString("hex"),
  DATABASE_URI: process.env.DATABASE_URI || "file:./data/cms/inmoment.db",
  BOT_API_HOST: process.env.BOT_API_HOST || url.hostname,
  OPENCLAW_API_KEY:
    process.env.OPENCLAW_API_KEY || randomBytes(32).toString("hex"),
};
for (const [key, v] of Object.entries(vars)) {
  const re = new RegExp("^" + key + "=.*$", "m");
  text = re.test(text)
    ? text.replace(re, () => key + "=" + v)
    : text.trimEnd() + "\n" + key + "=" + v + "\n";
  process.env[key] = v;
}
await writeFile(".env.local", text, { mode: 0o600 });
await chmod(".env.local", 0o600);
await mkdir("data/cms", { recursive: true });
const { getCMS } = await import("../lib/cms");
const cms = await getCMS();
await cms.db.migrate();
const found = await cms.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
});
if (!found.docs.length) {
  const password = randomBytes(24).toString("base64url");
  await cms.create({
    collection: "users",
    data: { email, password, name: "InMoment Admin" },
    overrideAccess: true,
  });
  await writeFile(
    ".admin-login.txt",
    `InMoment Payload CMS\nURL: ${origin}/admin\nEmail: ${email}\nPassword: ${password}\n\nSave these in your password manager, then remove this file.\n`,
    { mode: 0o600 },
  );
  await chmod(".admin-login.txt", 0o600);
  console.log(
    "Payload administrator created. Credentials are in .admin-login.txt; no secrets printed.",
  );
} else console.log("Existing Payload administrator preserved.");
console.log(
  "Next: npm run cms:import, npm run build, then restart the InMoment service.",
);
await cms.destroy();
