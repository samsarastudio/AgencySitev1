import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { scryptSync } from "node:crypto";
test("setup repairs partial configuration without rotating existing credentials", async () => {
  const dir = await mkdtemp(join(tmpdir(), "inmoment-setup-test-"));
  const hash =
    "abc123:" + scryptSync("existing-password", "abc123", 64).toString("hex");
  const key = "existing-bot-key-" + "a".repeat(40);
  const env = { ...process.env };
  for (const k of Object.keys(env))
    if (/^(ADMIN_|BOT_|OPENCLAW_|__NEXT_|NEXT_PUBLIC_)/.test(k)) delete env[k];
  try {
    await writeFile(
      join(dir, ".env.local"),
      `ADMIN_PASSWORD_HASH=${hash}\nOPENCLAW_API_KEY=${key}\n`,
    );
    const run = () =>
      spawnSync(
        process.execPath,
        [
          resolve("scripts/admin-setup.mjs"),
          "--origin",
          "https://inmomentservices.com",
        ],
        { cwd: dir, env, encoding: "utf8" },
      );
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const saved = await readFile(join(dir, ".env.local"), "utf8");
    assert.ok(saved.includes("ADMIN_PASSWORD_HASH=" + hash));
    assert.ok(saved.includes("OPENCLAW_API_KEY=" + key));
    assert.match(saved, /ADMIN_SESSION_SECRET=[a-f0-9]{96}/);
    assert.match(saved, /BOT_API_HOST=inmomentservices.com/);
    assert.ok(!first.stdout.includes(key));
    assert.ok(!first.stdout.includes(hash));
    assert.equal(run().status, 0);
    assert.equal(await readFile(join(dir, ".env.local"), "utf8"), saved);
  } finally {
    if (resolve(dir).startsWith(resolve(tmpdir()) + sep))
      await rm(dir, { recursive: true, force: true });
  }
});
