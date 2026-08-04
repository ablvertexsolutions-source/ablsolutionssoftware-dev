import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const AdminApp = lazy(() => import("../components/admin/AdminApp"));

const TITLE = "ABL Vertex Admin";
const DESCRIPTION = "Private ABL Vertex administration console.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="min-h-screen bg-[#04070f]">
      {mounted && (
        <Suspense fallback={null}>
          <AdminApp />
        </Suspense>
      )}
    </div>
  );
}
