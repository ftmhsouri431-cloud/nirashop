import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function isHostedRuntime(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim()) ||
    process.env.NODE_ENV === "production";
}

function readOrCreateSecretFile(fileName: string): string {
  const dir = join(process.cwd(), ".data");
  const path = join(dir, fileName);
  if (existsSync(path)) {
    const existing = readFileSync(path, "utf8").trim();
    if (existing) return existing;
  }
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const value = randomBytes(32).toString("hex");
  writeFileSync(path, value, { mode: 0o600 });
  return value;
}

/**
 * Resolve a signing secret from env, else a gitignored random file.
 * Never falls back to a hardcoded string in source.
 * Prefer setting ADMIN_SESSION_SECRET in Cursor Secrets for stable deploys.
 */
export function resolveSigningSecret(
  envName: string,
  fileName: string,
): string {
  const fromEnv = process.env[envName]?.trim();
  if (fromEnv) return fromEnv;
  return readOrCreateSecretFile(fileName);
}

/**
 * Local-only bootstrap password file (gitignored).
 * Hosted apps must set ADMIN_PASSWORD in Cursor Secrets.
 */
export function resolveLocalAdminPasswordFile(): string | null {
  if (isHostedRuntime()) return null;
  return readOrCreateSecretFile("admin-password");
}
