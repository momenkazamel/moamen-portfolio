#!/usr/bin/env node
// Generates the /admin login env vars. Run locally, never commit the output:
//   node scripts/admin-credentials.mjs <username>
// It asks for the password without echoing it, then prints ADMIN_USER,
// ADMIN_PASS_HASH and ADMIN_SECRET to paste into Vercel → Settings →
// Environment Variables (and into .env.local for local testing).
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const user = process.argv[2];
if (!user) {
  console.error("usage: node scripts/admin-credentials.mjs <username>");
  process.exit(1);
}

function ask(q) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.includes(q)) rl.output.write(s);
    };
    rl.question(q, (a) => {
      rl.close();
      process.stdout.write("\n");
      resolve(a);
    });
  });
}

const pass = await ask("Password: ");
const again = await ask("Again: ");
if (pass !== again) {
  console.error("Passwords don't match.");
  process.exit(1);
}
if (/[^\x20-\x7E]/.test(pass)) {
  console.error("The password has non-English characters — is the keyboard set to Arabic? Switch to English (Ctrl+Space) and run this again.");
  process.exit(1);
}
if (pass.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(pass, salt, 32);
console.log(`\nADMIN_USER=${user}`);
console.log(`ADMIN_PASS_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`ADMIN_SECRET=${randomBytes(32).toString("base64url")}`);
