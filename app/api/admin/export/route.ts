import { isAuthed, json, PRIVATE_HEADERS } from "@/lib/admin/auth";
import { readBooks } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

/** Full backup as a JSON download (same shape the import accepts). */
export async function GET(req: Request) {
  if (!isAuthed(req)) return json({ error: "unauthorized" }, 401);
  const { main, tx, debts, goals, commits } = await readBooks();
  const day = new Date().toISOString().slice(0, 10);
  const body = JSON.stringify({ exportedAt: new Date().toISOString(), main, tx, debts, goals, commits }, null, 2);
  return new Response(body, {
    headers: {
      ...PRIVATE_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="ledger-backup-${day}.json"`,
    },
  });
}
