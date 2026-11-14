import { isAuthed, json, sameOrigin } from "@/lib/admin/auth";
import { importBooks, isEmpty, readBooks } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

/** POST {data:{main,tx,debts,goals,commits}, replace?:true}. Refuses to overwrite real data unless replace is set. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!isAuthed(req)) return json({ error: "unauthorized" }, 401);
  const text = await req.text();
  if (text.length > 2_000_000) return json({ error: "too_large" }, 413);
  let body: { data?: unknown; replace?: boolean };
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!body.replace && !(await isEmpty())) return json({ error: "not_empty" }, 409);
  try {
    await importBooks(body.data);
  } catch {
    return json({ error: "bad_file" }, 400);
  }
  return json({ books: await readBooks() });
}
