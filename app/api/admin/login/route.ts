import { checkCredentials, credentialReport, createSession, isConfigured, json, sameOrigin, SESSION_DAYS, sessionCookie } from "@/lib/admin/auth";
import { clearFailures, clientIp, isLocked, recordFailure } from "@/lib/admin/limit";
import { storageConfigured } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!isConfigured() || !storageConfigured()) return json({ error: "not_configured" }, 503);
  const ip = clientIp(req);
  if (await isLocked(ip)) return json({ error: "locked" }, 429);

  let user = "";
  let pass = "";
  try {
    const body = await req.json();
    user = String(body?.user ?? "").slice(0, 100);
    pass = String(body?.pass ?? "").slice(0, 200);
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  if (!checkCredentials(user, pass)) {
    await recordFailure(ip);
    return json({ error: "wrong", report: credentialReport(user, pass) }, 401);
  }
  await clearFailures(ip);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(createSession(), SESSION_DAYS * 86400) });
}
