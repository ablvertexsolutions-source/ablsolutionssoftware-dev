import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import About from "./components/About";
import Approach from "./components/Approach";
import Contact, { Footer } from "./components/Contact";
import Cursor from "./components/Cursor";
import { DemoModal } from "./components/DemoForm";
import Hero from "./components/Hero";
import Intro, { shouldPlayIntro } from "./components/Intro";
import Nav from "./components/Nav";
import Preloader from "./components/Preloader";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import VideoModal from "./components/VideoModal";
import type { Project } from "./lib/data";
import { PointerProvider } from "./lib/interactions";
import { getLenis, useSmoothScroll } from "./lib/smooth";

const Background = lazy(() => import("./three/Background"));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [intro, setIntro] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [video, setVideo] = useState<Project | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useSmoothScroll();

  // cinematic landing intro — desktop only, once per visitor
  useEffect(() => {
    if (shouldPlayIntro()) setIntro(true);
  }, []);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const openDemo = useCallback(() => setDemoOpen(true), []);

  // mount the WebGL scene only once the entry animation has begun
  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [loaded]);

  return (
    <PointerProvider>
      {intro && <Intro onDone={() => setIntro(false)} />}
      <Preloader onDone={handleLoaded} />
      <Cursor />

      {/* ── immersive WebGL environment ─────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {sceneReady && (
          <Suspense fallback={null}>
            <Background />
          </Suspense>
        )}
        {/* depth layers over the canvas */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(37,99,235,0.16), transparent 60%), radial-gradient(90% 60% at 100% 100%, rgba(34,211,238,0.08), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(125,211,252,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.045) 1px, transparent 1px)",
            backgroundSize: "clamp(60px, 7vw, 110px) clamp(60px, 7vw, 110px)",
            maskImage:
              "radial-gradient(120% 90% at 50% 20%, #000 10%, rgba(0,0,0,0.35) 55%, transparent 85%)",
          }}
        />
      </div>

      {/* ── content ─────────────────────────────────── */}
      <AnimatePresence>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="grain relative z-10"
        >
          <Nav onDemo={openDemo} />
          <Hero onDemo={openDemo} />
          <About />
          <Approach />
          <Projects onWatch={setVideo} onDemo={openDemo} />
          <Skills />
          <Contact onDemo={openDemo} />
          <Footer />
        </motion.main>
      </AnimatePresence>

      {/* cinematic framing */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,7,15,0.62) 0%, transparent 9%, transparent 93%, rgba(4,7,15,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{ boxShadow: "inset 0 0 18vmin rgba(4,7,15,0.5)" }}
      />

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <VideoModal project={video} onClose={() => setVideo(null)} />
    </PointerProvider>
  );
}
