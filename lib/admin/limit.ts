import { redis } from "./store";

/*
 * Login throttling: 5 wrong tries from one IP locks that IP for 15 minutes,
 * and 20 wrong tries in an hour from anywhere locks the login for everyone
 * for the rest of that hour (so spreading guesses over many IPs doesn't help).
 */
const PER_IP = 5;
const IP_WINDOW = 15 * 60;
const GLOBAL = 20;
const GLOBAL_WINDOW = 60 * 60;

export function clientIp(req: Request) {
  return (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

export async function isLocked(ip: string) {
  const [a, g] = await redis().mget<(number | null)[]>(`admin:fail:${ip}`, "admin:fail:all");
  return Number(a) >= PER_IP || Number(g) >= GLOBAL;
}

export async function recordFailure(ip: string) {
  const r = redis();
  const p = r.pipeline();
  p.incr(`admin:fail:${ip}`);
  p.expire(`admin:fail:${ip}`, IP_WINDOW, "NX");
  p.incr("admin:fail:all");
  p.expire("admin:fail:all", GLOBAL_WINDOW, "NX");
  await p.exec();
}

export async function clearFailures(ip: string) {
  await redis().del(`admin:fail:${ip}`);
}
