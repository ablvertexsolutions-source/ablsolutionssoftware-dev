import { useSession } from "@tanstack/react-start/server";

export type AdminSession = { authed?: boolean; at?: number };

const ITER = 100_000;
export const DEFAULT_PASSWORD = "1111";
export const ADMIN_USERNAME = "admin";

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"] || "abl-vertex-solutions-admin-session-secret-32-chars";
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
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
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
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error && error.code === "PGRST205") {
      console.warn(`[admin] Table 'admin_settings' does not exist yet.`);
      return null;
    }
    return (data?.value as string | null) ?? null;
  } catch (e) {
    console.error("[admin] getSetting failed", e);
    return null;
  }
}

export async function setSetting(key: string, value: string | null) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("admin_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) {
      if (error.code === "PGRST205") {
        console.warn(`[admin] Table 'admin_settings' does not exist. Cannot save setting '${key}'. Admin login will continue using default credentials.`);
      } else {
        console.error(`[admin] setSetting error for '${key}':`, error.message);
      }
    }
  } catch (e) {
    console.error(`[admin] setSetting exception for '${key}':`, e);
  }
}
