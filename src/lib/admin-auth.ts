import "server-only";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Lightweight admin gate for the internal dashboard. The owner sets two env
 * vars (ADMIN_PASSWORD, ADMIN_SESSION_SECRET); login issues an HMAC-signed,
 * httpOnly+secure session cookie. Fails closed when unconfigured. (A future
 * migration to Supabase Auth is straightforward — see docs spec.)
 */

const PW = process.env.ADMIN_PASSWORD;
const SECRET = process.env.ADMIN_SESSION_SECRET;
const COOKIE = "cruz_admin";
const TTL_MS = 8 * 60 * 60 * 1000; // 8h

export function isAdminConfigured(): boolean {
  return Boolean(PW && PW.length >= 8 && SECRET && SECRET.length >= 16);
}

function sign(value: string): string {
  return createHmac("sha256", SECRET as string).update(value).digest("hex");
}

/** Constant-time password check (compares fixed-length SHA-256 digests). */
export function verifyPassword(input: string): boolean {
  if (!PW) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(PW).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !SECRET) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(exp);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
  const expNum = Number(exp);
  return Number.isFinite(expNum) && expNum > Date.now();
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}
