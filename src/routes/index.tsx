import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const PortfolioApp = lazy(() => import("../PortfolioApp"));

const TITLE = "Adrian Llano — AI Business Systems Engineer";
const DESCRIPTION =
  "20+ years of business operations fused with modern AI software engineering — payroll, hospitality, fleet and accounting systems built to pay for themselves.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#04070f]">
      <h1 className="sr-only">Adrian Llano — AI Business Systems Engineer</h1>
      {mounted && (
        <Suspense fallback={null}>
          <PortfolioApp />
        </Suspense>
      )}
    </div>
  );
}
