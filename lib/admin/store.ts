import { Redis } from "@upstash/redis";
import { randomBytes } from "node:crypto";

/*
 * The ledger's storage, in Upstash Redis (connected from Vercel → Storage,
 * which adds KV_REST_API_URL / KV_REST_API_TOKEN to the project).
 *
 *   books:main                 settings document {companyName, rates, cash, ...}
 *   books:tx / debts / goals / commits   hashes: id → document
 *   books:rev                  counter bumped on every write (lets other open
 *                              tabs/devices know they are out of date)
 *   books:backup:<YYYY-MM-DD>  first-write-of-the-day snapshot, kept 60 days
 */

export const COLS = ["tx", "debts", "goals", "commits"] as const;
export type Col = (typeof COLS)[number];
type Doc = Record<string, unknown>;
export type Books = { main: Doc; tx: Doc[]; debts: Doc[]; goals: Doc[]; commits: Doc[]; rev: number };

let client: Redis | null = null;
export function redis() {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error("storage not configured");
    client = new Redis({ url, token });
  }
  return client;
}
export const storageConfigured = () =>
  !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);

const K = { main: "books:main", rev: "books:rev", col: (c: Col) => `books:${c}` };

export const isCol = (c: unknown): c is Col => typeof c === "string" && (COLS as readonly string[]).includes(c);
export const isId = (id: unknown): id is string => typeof id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(id);
const newId = () => randomBytes(10).toString("base64url");
const isPlain = (v: unknown): v is Doc => !!v && typeof v === "object" && !Array.isArray(v);

/** Drops anything that could pollute prototypes or overwrite the id. */
function clean(data: Doc): Doc {
  const out: Doc = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "id" || k === "__proto__" || k === "constructor" || k === "prototype") continue;
    out[k] = v;
  }
  return out;
}

export async function readBooks(): Promise<Books> {
  const r = redis();
  const p = r.pipeline();
  p.get(K.main);
  p.get(K.rev);
  COLS.forEach((c) => p.hgetall(K.col(c)));
  const [main, rev, ...cols] = (await p.exec()) as [Doc | null, number | null, ...(Record<string, Doc> | null)[]];
  const out: Books = { main: main || {}, rev: Number(rev) || 0, tx: [], debts: [], goals: [], commits: [] };
  COLS.forEach((c, i) => {
    out[c] = Object.entries(cols[i] || {}).map(([id, d]) => ({ ...(d as Doc), id }));
  });
  return out;
}

async function dailyBackup() {
  const r = redis();
  const day = new Date().toISOString().slice(0, 10);
  const key = `books:backup:${day}`;
  if (await r.exists(key)) return;
  const b = await readBooks();
  await r.set(key, b, { ex: 60 * 864e2, nx: true });
}

export type Op =
  | { op: "add"; col: Col; data: Doc }
  | { op: "update"; col: Col; id: string; data: Doc }
  | { op: "delete"; col: Col; id: string }
  | { op: "settings"; data: Doc };

export function parseOps(body: unknown): Op[] | null {
  const ops = isPlain(body) ? body.ops : null;
  if (!Array.isArray(ops) || !ops.length || ops.length > 200) return null;
  const out: Op[] = [];
  for (const o of ops) {
    if (!isPlain(o)) return null;
    if (o.op === "settings" && isPlain(o.data)) out.push({ op: "settings", data: clean(o.data) });
    else if (o.op === "add" && isCol(o.col) && isPlain(o.data)) out.push({ op: "add", col: o.col, data: clean(o.data) });
    else if (o.op === "update" && isCol(o.col) && isId(o.id) && isPlain(o.data))
      out.push({ op: "update", col: o.col, id: o.id, data: clean(o.data) });
    else if (o.op === "delete" && isCol(o.col) && isId(o.id)) out.push({ op: "delete", col: o.col, id: o.id });
    else return null;
  }
  return out;
}

export async function applyOps(ops: Op[]) {
  const r = redis();
  await dailyBackup();
  const added: string[] = [];
  for (const o of ops) {
    if (o.op === "settings") await r.set(K.main, o.data);
    else if (o.op === "add") {
      const id = newId();
      await r.hset(K.col(o.col), { [id]: o.data });
      added.push(id);
    } else if (o.op === "update") {
      const cur = await r.hget<Doc>(K.col(o.col), o.id);
      if (!cur) continue; // deleted from another device meanwhile
      await r.hset(K.col(o.col), { [o.id]: { ...cur, ...o.data } });
    } else await r.hdel(K.col(o.col), o.id);
  }
  await r.incr(K.rev);
  return added;
}

export async function isEmpty() {
  const b = await readBooks();
  return COLS.every((c) => !b[c].length) && !Object.keys(b.main).length;
}

/** Replaces everything with an imported export (the old claude.ai ledger, or a backup). */
export async function importBooks(data: unknown) {
  if (!isPlain(data)) throw new Error("bad file");
  const r = redis();
  const current = await readBooks();
  await r.set(`books:backup:before-import:${Date.now()}`, current, { ex: 90 * 864e2 });
  const p = r.pipeline();
  p.set(K.main, isPlain(data.main) ? clean(data.main) : {});
  for (const c of COLS) {
    p.del(K.col(c));
    const list = Array.isArray(data[c]) ? (data[c] as unknown[]) : [];
    const entries: Record<string, Doc> = {};
    for (const d of list) {
      if (!isPlain(d)) continue;
      entries[isId(d.id) ? d.id : newId()] = clean(d);
    }
    if (Object.keys(entries).length) p.hset(K.col(c), entries);
  }
  p.incr(K.rev);
  await p.exec();
}

export async function currentRev() {
  return Number(await redis().get(K.rev)) || 0;
}
