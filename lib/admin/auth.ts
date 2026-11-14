import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

/*
 * Single-owner login for /admin.
 *
 * Nothing secret lives in the repo. Three env vars (set in Vercel → Settings →
 * Environment Variables, generated with `node scripts/admin-credentials.mjs`):
 *   ADMIN_USER       the username
 *   ADMIN_PASS_HASH  "scrypt:<salt hex>:<hash hex>" of the password
 *   ADMIN_SECRET     random key that signs the session cookie
 *
 * The session cookie is `<expiry>.<hmac>`, signed with a key derived from
 * ADMIN_SECRET *and* ADMIN_PASS_HASH, so changing the password (or the
 * secret) logs every device out at once.
 */

export const SESSION_COOKIE = "mk_admin";
export const SESSION_DAYS = 30;

type Config = { user: string; passHash: string; secret: string };

function config(): Config | null {
  const user = process.env.ADMIN_USER;
  const passHash = process.env.ADMIN_PASS_HASH;
  const secret = process.env.ADMIN_SECRET;
  if (!user || !passHash || !secret || secret.length < 32) return null;
  return { user, passHash, secret };
}

export const isConfigured = () => config() !== null;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare equal-length buffers so the timing doesn't leak the length.
  const len = Math.max(ab.length, bb.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  ab.copy(pa);
  bb.copy(pb);
  return timingSafeEqual(pa, pb) && ab.length === bb.length;
}

export function checkCredentials(user: string, pass: string) {
  const c = config();
  if (!c) return false;
  const [scheme, saltHex, hashHex] = c.passHash.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  // Always run scrypt, even for a wrong username, so both cases take the same time.
  const got = scryptSync(pass, Buffer.from(saltHex, "hex"), expected.length);
  const passOk = timingSafeEqual(got, expected);
  const userOk = safeEqual(user.trim().toLowerCase(), c.user.trim().toLowerCase());
  return passOk && userOk;
}

function signingKey(c: Config) {
  return createHmac("sha256", c.secret).update(c.passHash).digest();
}

export function createSession() {
  const c = config();
  if (!c) throw new Error("admin not configured");
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const mac = createHmac("sha256", signingKey(c)).update(`v1.${exp}`).digest("base64url");
  return `${exp}.${mac}`;
}

export function verifySession(token: string | undefined | null) {
  const c = config();
  if (!c || !token) return false;
  const [expStr, mac] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() || !mac) return false;
  const want = createHmac("sha256", signingKey(c)).update(`v1.${exp}`).digest("base64url");
  return safeEqual(mac, want);
}

function readCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export const isAuthed = (req: Request) => verifySession(readCookie(req, SESSION_COOKIE));

/** Blocks cross-site form posts: a write must come from this same site. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export function sessionCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export const PRIVATE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

export const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...PRIVATE_HEADERS, ...extra },
  });
