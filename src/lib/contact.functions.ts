import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(60),
  country: z.string().trim().min(1).max(90),
  subject: z.string().trim().min(1).max(160),
  system: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(4000),
});

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const sendDemoRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Email service is not configured yet." };
    }

    const submitted = new Date().toUTCString();
    const rows: [string, string][] = [
      ["Name", data.name],
      ["Company", data.company],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Country", data.country],
      ["System", data.system],
      ["Subject", data.subject],
      ["Message", data.message],
      ["Submitted", submitted],
    ];

    const text = `A new demo request has been submitted.\n\n${rows
      .map(([k, v]) => `${k}:\n${v}`)
      .join("\n\n")}`;

    const html = `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#0b1222">
      <p>A new demo request has been submitted.</p>
      ${rows
        .map(
          ([k, v]) =>
            `<p style="margin:0 0 14px"><strong>${k}:</strong><br/>${esc(v).replace(/\n/g, "<br/>")}</p>`,
        )
        .join("")}
    </div>`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Adrian Llano Portfolio <onboarding@resend.dev>",
          to: ["adrian.llano79@gmail.com"],
          reply_to: data.email,
          subject: "New Demo Request – Adrian Llano Portfolio",
          text,
          html,
        }),
      });

      if (!res.ok) {
        console.error("Resend error", res.status, await res.text());
        return { ok: false as const, error: "We couldn't send your request. Please try again." };
      }
      return { ok: true as const };
    } catch (err) {
      console.error("Resend request failed", err);
      return { ok: false as const, error: "We couldn't send your request. Please try again." };
    }
  });