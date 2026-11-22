import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  resolveLocalAdminPasswordFile,
  resolveSigningSecret,
} from "./runtime-secret";
import { getSettings } from "./settings";

const COOKIE = "nira_admin";

function secret(): string {
  return resolveSigningSecret("ADMIN_SESSION_SECRET", "session-secret");
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function makeSessionToken(): string {
  const payload = `ok:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}

export async function resolveExpectedAdminPassword(): Promise<string | null> {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;

  const settings = await getSettings();
  if (settings.adminPassword?.trim()) return settings.adminPassword.trim();

  return resolveLocalAdminPasswordFile();
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = await resolveExpectedAdminPassword();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    secure:
      process.env.NODE_ENV === "production" ||
      process.env.COOKIE_SECURE === "true",
  };
}

export { COOKIE as ADMIN_COOKIE };
