import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type DemoRequest = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  work_email: string;
  company: string | null;
  phone: string | null;
  country: string | null;
  subject: string | null;
  system_interest: string | null;
  message: string | null;
  status: string;
  notes: string | null;
};

export const STATUSES = [
  "NEW",
  "READ",
  "IN PROGRESS",
  "REPLIED",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin } = await import("./admin.server");
  return { authed: await isAdmin() };
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        username: z.string().trim().max(100).optional().default("admin"),
        password: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const m = await import("./admin.server");
    // Ensure tables exist (self-healing for first-run / missing migrations)
    try {
      const { ensureTables } = await import("@/integrations/supabase/client.server");
      await ensureTables();
    } catch { /* ignore – will surface via getSetting below */ }

    if (data.username.toLowerCase() !== m.ADMIN_USERNAME) {
      return { ok: false, error: "Invalid username or password." };
    }

    let stored: string | null;
    try {
      stored = await m.getSetting("password_hash");
    } catch (e) {
      console.error("[admin] settings read failed", e);
      return { ok: false, error: "Database connection failed. Please try again." };
    }

    try {
      let ok = false;
      if (!stored) {
        // First run: the default password is accepted once and stored hashed.
        ok = data.password === m.DEFAULT_PASSWORD;
        if (ok) await m.setSetting("password_hash", await m.hashPassword(m.DEFAULT_PASSWORD));
      } else {
        ok = await m.verifyPassword(data.password, stored);
        // Safety net: the documented default keeps working until it is changed.
        if (!ok && data.password === m.DEFAULT_PASSWORD) {
          ok = await m.verifyPassword(m.DEFAULT_PASSWORD, stored);
        }
      }
      if (!ok) return { ok: false, error: "Invalid username or password." };

      const session = await m.getAdminSession();
      await session.update({ authed: true, at: Date.now() });
      return { ok: true };
    } catch (e) {
      console.error("[admin] login failed", e);
      return { ok: false, error: "Admin authentication service is unavailable." };
    }
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin.server");
  const s = await getAdminSession();
  await s.clear();
  return { ok: true as const };
});

export const adminChangePassword = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ current: z.string().min(1), next: z.string().min(4).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const m = await import("./admin.server");
    await m.requireAdmin();
    const stored = await m.getSetting("password_hash");
    const ok = stored
      ? await m.verifyPassword(data.current, stored)
      : data.current === m.DEFAULT_PASSWORD;
    if (!ok) return { ok: false as const, error: "Current password is incorrect." };
    await m.setSetting("password_hash", await m.hashPassword(data.next));
    return { ok: true as const };
  });

export const listRequests = createServerFn({ method: "GET" })
  .validator((d: unknown) =>
    z.object({ search: z.string().max(200).default(""), status: z.string().max(40).default("All") }).parse(d),
  )
  .handler(async ({ data }): Promise<{ rows: DemoRequest[] }> => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin();
    const { supabaseAdmin, ensureTables } = await import("@/integrations/supabase/client.server");
    await ensureTables();
    let q = supabaseAdmin
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status && data.status !== "All") q = q.ilike("status", data.status);
    const term = data.search.trim().replace(/[%,()]/g, "");
    if (term) {
      const cols = ["full_name", "company", "work_email", "phone", "country", "subject", "system_interest"];
      q = q.or(cols.map((c) => `${c}.ilike.%${term}%`).join(","));
    }
    const { data: rows, error } = await q.returns<DemoRequest[]>();
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const updateRequest = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().max(40).optional(),
        notes: z.string().max(8000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { status?: string; notes?: string } = {};
    if (data.status) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await supabaseAdmin.from("demo_requests").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteRequest = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("demo_requests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const backupData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("demo_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<DemoRequest[]>();
  if (error) throw new Error(error.message);
  return {
    app: "ABL VERTEX",
    version: 1,
    exported_at: new Date().toISOString(),
    demo_requests: data ?? [],
  };
});

const backupSchema = z.object({
  app: z.string().optional(),
  version: z.number().optional(),
  demo_requests: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        created_at: z.string().optional(),
        full_name: z.string(),
        work_email: z.string(),
        company: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        subject: z.string().nullable().optional(),
        system_interest: z.string().nullable().optional(),
        message: z.string().nullable().optional(),
        status: z.string().optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .max(5000),
});

export const restoreData = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ payload: z.string().max(8_000_000) }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin();
    let parsed;
    try {
      parsed = backupSchema.parse(JSON.parse(data.payload));
    } catch {
      return { ok: false as const, error: "Invalid backup file structure." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = parsed.demo_requests.map((r) => ({ ...r, status: r.status ?? "NEW" }));
    if (!rows.length) return { ok: false as const, error: "Backup contains no records." };
    const { error } = await supabaseAdmin.from("demo_requests").upsert(rows, { onConflict: "id" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, count: rows.length };
  });

export const saveSplashImage = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ dataUrl: z.string().max(4_000_000).nullable() }).parse(d),
  )
  .handler(async ({ data }) => {
    const m = await import("./admin.server");
    await m.requireAdmin();
    if (data.dataUrl && !/^data:image\/(png|jpe?g|webp);base64,/.test(data.dataUrl)) {
      return { ok: false as const, error: "Unsupported image format." };
    }
    await m.setSetting("splash_image", data.dataUrl);
    return { ok: true as const };
  });

export const adminAnalytics = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("demo_requests")
    .select("created_at, status, country, system_interest")
    .returns<Pick<DemoRequest, "created_at" | "status" | "country" | "system_interest">[]>();
  if (error) throw new Error(error.message);
  return { rows: data ?? [] };
});
