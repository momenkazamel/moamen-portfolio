import { readFile } from "node:fs/promises";
import path from "node:path";
import { isAuthed, isConfigured, PRIVATE_HEADERS } from "@/lib/admin/auth";
import { storageConfigured } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

/*
 * /admin is a plain route handler (not a page) so the private ledger never
 * goes through the public site's layout, analytics or static caching. Signed
 * in → the ledger; otherwise → the login screen. The ledger's HTML is only
 * ever sent to a valid session. The HTML files are pulled into the Vercel
 * function via outputFileTracingIncludes in next.config.ts.
 */
const dir = path.join(process.cwd(), "lib/admin/pages");

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

export async function GET(req: Request) {
  const ready = isConfigured() && storageConfigured();
  const file = ready && isAuthed(req) ? "ledger.html" : "login.html";
  let html = await readFile(path.join(dir, file), "utf8");
  if (!ready) {
    html = html.replace("<!--SETUP-->", '<p class="setup">اللوحة لسه محتاجة إعداد على Vercel (الداتابيز وبيانات الدخول).</p>');
  }
  return new Response(html, {
    headers: { ...PRIVATE_HEADERS, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": CSP },
  });
}
