import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "allmix_admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET não configurada.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue(username: string) {
  const payload = `${username}.${Date.now()}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionValue(sessionValue?: string) {
  if (!sessionValue) return false;
  const parts = sessionValue.split(".");
  if (parts.length < 3) return false;
  const signature = parts.pop()!;
  const payload = parts.join(".");
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  return verifySessionValue(value);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
