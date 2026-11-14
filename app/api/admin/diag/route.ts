import { json } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/*
 * TEMPORARY login diagnostic — remove once /admin login works.
 * Reveals nothing usable: the deployed commit, whether each env var is
 * present and well-formed, the first 4 hex chars of the (non-secret) salt,
 * and the username's length.
 */
export async function GET() {
  const clean = (v?: string) => (v || "").trim().replace(/^[A-Z_]+=/, "").replace(/^["']|["']$/g, "").trim();
  const user = clean(process.env.ADMIN_USER);
  const hash = clean(process.env.ADMIN_PASS_HASH);
  const secret = clean(process.env.ADMIN_SECRET);
  const [scheme, salt, h] = hash.split(":");
  return json({
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7),
    userLength: user.length,
    userRawLength: (process.env.ADMIN_USER || "").length,
    hashOk: scheme === "scrypt" && /^[0-9a-f]{32}$/.test(salt || "") && /^[0-9a-f]{64}$/.test(h || ""),
    hashRawLength: (process.env.ADMIN_PASS_HASH || "").length,
    saltStart: (salt || "").slice(0, 4),
    secretOk: secret.length >= 32,
    storage: !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
  });
}
