import { createAPIFileRoute } from "@tanstack/react-start/api";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const demoRequestSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(5).max(50),
  country: z.string().min(2).max(100),
  subject: z.string().min(2).max(200),
  system: z.string().min(2).max(100),
  message: z.string().min(10).max(5000),
});

export const APIRoute = createAPIFileRoute("/api/demo-request")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const validatedData = demoRequestSchema.parse(body);

      // Basic Rate Limiting using Prisma
      const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentRequests = await prisma.demoRequest.count({
        where: {
          ipAddress,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });

      if (recentRequests >= 3) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Save to database
      const demoRequest = await prisma.demoRequest.create({
        data: {
          fullName: validatedData.name,
          companyName: validatedData.company,
          email: validatedData.email,
          phone: validatedData.phone,
          country: validatedData.country,
          subject: validatedData.subject,
          systemInterest: validatedData.system,
          message: validatedData.message,
          ipAddress,
          userAgent,
        },
      });

      const emailHtml = `
        <h2>New Demo Request</h2>
        <hr />
        <p><strong>Full Name:</strong> ${validatedData.name}</p>
        <p><strong>Company:</strong> ${validatedData.company}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Country:</strong> ${validatedData.country}</p>
        <p><strong>System Interested:</strong> ${validatedData.system}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <br />
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\\n/g, "<br/>")}</p>
        <hr />
        <p><small>Submitted At: ${demoRequest.createdAt.toISOString()}</small></p>
        <p><small>IP Address: ${ipAddress}</small></p>
        <p><small>Browser: ${userAgent}</small></p>
      `;

      // Send to Admin
      await resend.emails.send({
        from: "Demo Requests <demo@ablsolutions.com>",
        to: ["adrian.llano79@gmail.com"],
        subject: `New Demo Request — ${validatedData.name}`,
        html: emailHtml,
        replyTo: validatedData.email,
      });

      // Send Auto Reply
      await resend.emails.send({
        from: "Adrian Llano <adrian@ablsolutions.com>",
        to: [validatedData.email],
        subject: "Thank You for Requesting a Demo",
        text: `Hello ${validatedData.name},\n\nThank you for your interest in our software solutions.\n\nYour demo request has been received successfully.\n\nI will personally review your inquiry and contact you as soon as possible.\n\nBest regards,\n\nAdrian Llano\nApps & Systems Developer\nABL Software Solutions`,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Demo request error:", error);
      return new Response(JSON.stringify({ error: "Invalid request or server error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
