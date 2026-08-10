import { useSession } from "@tanstack/react-start/server";

export type AdminSession = { authed?: boolean; at?: number };

const ITER = 100_000;
export const DEFAULT_PASSWORD = "1111";
export const ADMIN_USERNAME = "admin";

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("Admin session configuration is unavailable.");
  return {
    password,
    name: "abl-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" },
  };
}

export async function getAdminSession() {
  return useSession<AdminSession>(sessionConfig());
}

export async function isAdmin() {
  const s = await getAdminSession();
  return Boolean(s.data.authed);
}

export async function requireAdmin() {
  const s = await getAdminSession();
  if (!s.data.authed) throw new Error("Unauthorized");
  return s;
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function derive(password: string, saltHex: string, iter: number) {
  const saltParts = saltHex.match(/.{2}/g);
  if (!saltParts) throw new Error("Invalid password hash.");
  const salt = Uint8Array.from(saltParts.map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashPassword(password: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  return `pbkdf2$${ITER}$${salt}$${await derive(password, salt, ITER)}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, iter, salt, hash] = stored.split("$");
  if (!iter || !salt || !hash) return false;
  const candidate = await derive(password, salt, Number(iter));
  if (candidate.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

export async function getSetting(key: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("admin_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("[admin] settings read failed", error.message);
    throw new Error("Admin credential storage is unavailable.");
  }
  return (data?.value as string | null) ?? null;
}

export async function setSetting(key: string, value: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("admin_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    console.error(`[admin] settings write failed for '${key}'`, error.message);
    throw new Error("Admin credential storage is unavailable.");
  }
}
