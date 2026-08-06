import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  work_email: z.string().trim().email().max(255),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(60).optional().default(""),
  country: z.string().trim().max(120).optional().default(""),
  country_code: z.string().trim().max(10).optional().default(""),
  system_interest: z.string().trim().max(160).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(4000),
});

export const submitDemoRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("demo_requests")
      .insert({ ...data, status: "NEW" })
      .select("id, created_at")
      .single();
    if (error) {
      console.error("[demo_requests] insert failed", error.message);
      throw new Error(`Could not save your request: ${error.message}`);
    }
    return { id: row.id as string, created_at: row.created_at as string };
  });

export const getSplashImage = createServerFn({ method: "GET" }).handler(async () => {
  const { getSetting } = await import("./admin.server");
  return { url: await getSetting("splash_image") };
});
