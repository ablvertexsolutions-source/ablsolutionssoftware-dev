import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
  // The app is also served inside embedded previews, where the browser reports
  // "same-site"/"none" for its own same-origin requests.
  secFetchSite: ["same-origin", "same-site", "none"],
  origin: (value, ctx) => {
    try {
      const requestOrigin = new URL(ctx.request.url).origin;
      if (value === requestOrigin) return true;
      const host = new URL(value).hostname;
      return host.endsWith(".lovable.app") || host.endsWith(".vercel.app");
    } catch {
      return false;
    }
  },
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
