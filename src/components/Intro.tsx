import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const KEY = "abl-vertex-intro-seen";

export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(KEY) === "1") return false;
  } catch {
    /* private mode — still play once per session */
  }
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  return !mobile;
}

/**
 * Premium cinematic landing intro — GPU-composited (transform/opacity/filter only).
 * Scene 1: black → futuristic car rear reveal in blue volumetric fog.
 * Scene 2: rev, light streaks, camera shake, tire smoke.
 * Scene 3: smoke clears onto chrome "ABL VERTEX", then dissolves into particles.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);

  const finish = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
    setTimeout(onDone, 700);
  };

  useEffect(() => {
    const t = setTimeout(finish, reduced ? 900 : 4900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const sparks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 40 + Math.random() * 30,
        d: 1.6 + Math.random() * 1.8,
        delay: 3 + Math.random() * 1.2,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#02040a]"
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          {/* Scene 1 — car reveal */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: [0, 1, 1, 0.25], scale: [1.18, 1.05, 1.02, 1.1] }}
            transition={{ duration: 4.4, times: [0, 0.22, 0.6, 1], ease: "easeInOut" }}
          >
            <img
              src="/images/intro-car.jpg"
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.85) saturate(1.15) contrast(1.1)" }}
            />
            {/* blue volumetric wash */}
            <span
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 50% 60%, rgba(37,99,235,0.28), transparent 70%), linear-gradient(180deg, rgba(2,4,10,0.85), transparent 40%, rgba(2,4,10,0.9))",
              }}
            />
          </motion.div>

          {/* Scene 2 — light streaks + camera shake */}
          <motion.span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 40%, rgba(125,211,252,0.5) 50%, transparent 60%)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-60%", opacity: 0 }}
            animate={{ x: ["-60%", "60%"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, delay: 1.5, ease: "easeInOut" }}
          />

          {/* Scene 2/3 — tire smoke rolling up and clearing */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(190,215,245,0.55), rgba(120,150,190,0.25) 45%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.3, y: "40%" }}
              animate={{ opacity: [0, 0.9, 0.85, 0], scale: [0.3, 1.1, 1.3, 1.5], y: ["40%", "0%", "-6%", "-14%"] }}
              transition={{ duration: 3.1, delay: 1.6 + i * 0.22, ease: "easeOut" }}
            />
          ))}

          {/* Scene 3 — chrome wordmark */}
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center"
            initial={{ opacity: 0, scale: 1.14, filter: "blur(18px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [1.14, 1, 1, 1.06],
              filter: ["blur(18px)", "blur(0px)", "blur(0px)", "blur(16px)"],
            }}
            transition={{ duration: 2.4, delay: 2.6, times: [0, 0.28, 0.78, 1], ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 45% at 50% 50%, rgba(2,4,10,0.82), rgba(2,4,10,0.35) 60%, transparent 80%)",
              }}
            />
            <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 1.14, filter: "blur(18px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [1.14, 1, 1, 1.06],
              filter: ["blur(18px)", "blur(0px)", "blur(0px)", "blur(16px)"],
            }}
            transition={{ duration: 2.4, delay: 2.6, times: [0, 0.28, 0.78, 1], ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative px-6 text-center">
              <h1
                className="font-display text-[clamp(2.4rem,10vw,7rem)] font-light tracking-[0.16em]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,#ffffff 0%,#cfe4ff 28%,#7aa6d8 48%,#ffffff 62%,#9dc3ea 80%,#e8f3ff 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 0 26px rgba(59,130,246,0.55))",
                }}
              >
                ABL VERTEX
              </h1>
              {/* animated light sweep across the chrome */}
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)",
                  mixBlendMode: "overlay",
                }}
                animate={{ x: ["-70%", "70%"] }}
                transition={{ duration: 1.6, delay: 2.9, ease: "easeInOut" }}
              />
            </div>
            </motion.div>
          </motion.div>

          {/* dissolve sparks */}
          {sparks.map((s) => (
            <motion.span
              key={s.id}
              className="pointer-events-none absolute h-[3px] w-[3px] rounded-full bg-sky-200"
              style={{ left: `${s.x}%`, top: `${s.y}%`, boxShadow: "0 0 10px rgba(125,211,252,0.9)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-4, -70], x: [0, (s.x - 50) * 0.6] }}
              transition={{ duration: s.d, delay: s.delay, ease: "easeOut" }}
            />
          ))}

          {/* vignette + grain framing */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 24vmin rgba(2,4,10,0.85)" }}
          />

          <button
            onClick={finish}
            aria-hidden={false}
            className="glass absolute bottom-8 right-6 rounded-full px-5 py-2.5 font-display text-[10px] uppercase tracking-[0.26em] text-white/70 transition hover:text-white sm:right-10"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}