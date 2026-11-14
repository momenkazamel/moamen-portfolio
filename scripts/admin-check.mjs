#!/usr/bin/env node
// Checks locally whether a password matches an ADMIN_PASS_HASH value,
// without sending anything anywhere:  node scripts/admin-check.mjs
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { createInterface } from "node:readline";

function ask(q, hidden) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s); };
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a); });
  });
}

const raw = (await ask("Paste the ADMIN_PASS_HASH value: ", true)).trim().replace(/^ADMIN_PASS_HASH=/, "").replace(/^["']|["']$/g, "");
const pass = await ask("Password: ", true);
const [scheme, salt, hash] = raw.split(":");
if (scheme !== "scrypt" || !/^[0-9a-f]{32}$/.test(salt || "") || !/^[0-9a-f]{64}$/.test(hash || "")) {
  console.log("✗ The hash value is not in the right shape (it was cut off or has extra text).");
  process.exit(1);
}
const ok = timingSafeEqual(scryptSync(pass, Buffer.from(salt, "hex"), 32), Buffer.from(hash, "hex"));
console.log(ok ? "✓ Password matches this hash." : "✗ Password does NOT match this hash.");
