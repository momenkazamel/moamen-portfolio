import { isAuthed, json, sameOrigin } from "@/lib/admin/auth";
import { applyOps, currentRev, parseOps, readBooks } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

const MAX_BODY = 200_000;

/** GET → whole ledger. GET ?rev=N → {same:true} when nothing changed since N. */
export async function GET(req: Request) {
  if (!isAuthed(req)) return json({ error: "unauthorized" }, 401);
  const since = new URL(req.url).searchParams.get("rev");
  if (since !== null && Number(since) === (await currentRev())) return json({ same: true });
  return json(await readBooks());
}

/** POST {ops:[...]} → applies the changes and returns the fresh ledger. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!isAuthed(req)) return json({ error: "unauthorized" }, 401);
  const text = await req.text();
  if (text.length > MAX_BODY) return json({ error: "too_large" }, 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const ops = parseOps(body);
  if (!ops) return json({ error: "bad_request" }, 400);
  const added = await applyOps(ops);
  return json({ added, books: await readBooks() });
}
