import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Splash from "../components/Splash";
import Welcome from "../components/Welcome";
import { getSplashImage } from "../lib/demo.functions";

const TITLE = "ABL Vertex — Business Systems, Software & Intelligent Automation";
const DESCRIPTION =
  "ABL Vertex builds custom business systems: payroll, hospitality, fleet and accounting software with intelligent automation.";

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
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSplashImage()
      .then((r) => setImage(r.url))
      .catch(() => setImage(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#04070f]">
      {mounted && !splashDone && <Splash image={image} onDone={() => setSplashDone(true)} />}
      {splashDone && (
        <Welcome
          onVisit={() => navigate({ to: "/site" })}
          onAdmin={() => navigate({ to: "/admin" })}
        />
      )}
    </main>
  );
}
