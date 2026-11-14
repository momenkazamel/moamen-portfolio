import { json, sameOrigin, sessionCookie } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}
