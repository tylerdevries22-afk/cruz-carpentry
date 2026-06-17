import "server-only";
import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Customer account auth: scrypt-hashed passwords + an HMAC-signed httpOnly
 * session cookie (signed with ADMIN_SESSION_SECRET, the app's session key).
 * Accounts are auto-created on form submit; a password (set optionally in the
 * wizard) enables login at /login. Fails closed when no session secret is set.
 *
 * (Long-term this can migrate to Supabase Auth once the dashboard is
 * configured; the storage shape — customers.password_hash — is self-contained.)
 */

const SECRET = process.env.ADMIN_SESSION_SECRET;
const COOKIE = "cruz_user";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function isSessionConfigured(): boolean {
  return Boolean(SECRET && SECRET.length >= 16);
}

/** scrypt hash, stored as `salt:hash` (both hex). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// A throwaway salt:hash used to equalize timing when there is no real stored
// hash (account missing, or exists with no password set), so an attacker can't
// distinguish those states from a wrong password by response time.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(128)}`;

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  const hasReal =
    typeof stored === "string" && stored.includes(":") && stored.split(":").every(Boolean);
  // Always run scrypt — against a dummy hash when there's no real one — so the
  // work performed is constant regardless of whether the account/password exists.
  const [saltHex, hashHex] = (hasReal ? (stored as string) : DUMMY_HASH).split(":");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  const match = expected.length === actual.length && timingSafeEqual(expected, actual);
  return hasReal && match;
}

function sign(value: string): string {
  return createHmac("sha256", SECRET as string).update(value).digest("hex");
}

function createToken(customerId: string): string {
  const exp = String(Date.now() + TTL_MS);
  const body = `${customerId}.${exp}`;
  return `${body}.${sign(body)}`;
}

/** Returns the customer id from a valid, unexpired session token, else null. */
export function readToken(token: string | undefined): string | null {
  if (!token || !SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [customerId, exp, sig] = parts;
  const expectedSig = sign(`${customerId}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum <= Date.now()) return null;
  return customerId;
}

export async function setCustomerCookie(customerId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, createToken(customerId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function clearCustomerCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getCurrentCustomerId(): Promise<string | null> {
  const store = await cookies();
  return readToken(store.get(COOKIE)?.value);
}
