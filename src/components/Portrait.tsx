import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useState } from "react";
import { usePointer } from "../lib/interactions";

export type Intent = "idle" | "demo" | "projects" | "resume";

/**
 * The real portrait photograph — never replaced, only *animated*:
 * breathing, floating, blink, subtle head + shoulder motion and a
 * soft rim glow. Hover intents make him lean and gesture.
 * Swap `public/images/portrait.png` with any updated photo.
 */
export default function Portrait({ intent }: { intent: Intent }) {
  const { nx, ny } = usePointer();
  const [failed, setFailed] = useState(false);

  // head / shoulder parallax
  const headX = useTransform(nx, (v) => v * 12);
  const headY = useTransform(ny, (v) => v * 8);
  const frameX = useTransform(nx, (v) => v * -6);
  const tilt = useTransform(nx, (v) => v * 2.4);

  const lean =
    intent === "demo"
      ? { x: -14, rotate: -1.8 }
      : intent === "projects"
        ? { x: 16, rotate: 2.0 }
        : intent === "resume"
          ? { x: 0, rotate: 0, y: -6 }
          : { x: 0, rotate: 0, y: 0 };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[430px]"
      style={{ x: frameX }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* aura */}
      <motion.div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), rgba(34,211,238,0.10) 45%, transparent 70%)",
        }}
        animate={{ opacity: intent === "idle" ? [0.55, 0.85, 0.55] : 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* rotating conic ring */}
      <motion.div
        aria-hidden
        className="absolute -inset-[6%] -z-10 rounded-[42%] opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(59,130,246,0.55), transparent 35%, rgba(34,211,238,0.45), transparent 70%)",
          filter: "blur(26px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative"
        animate={lean}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* glass plinth */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/10"
          style={{
            background:
              "linear-gradient(170deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))",
            boxShadow:
              "0 60px 120px -50px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <motion.div
            className="relative"
            style={{ x: headX, y: headY }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            <div style={{ animation: "breathe 5.4s ease-in-out infinite" }}>
              {failed ? (
                <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-b from-slate-800/40 to-slate-950">
                  <span className="font-display text-6xl font-light tracking-[0.2em] text-white/25">
                    AL
                  </span>
                </div>
              ) : (
                <img
                  src="/images/portrait.png"
                  alt="Adrian Llano"
                  width={860}
                  height={1075}
                  decoding="async"
                  onError={() => setFailed(true)}
                  className="aspect-[4/5] w-full select-none object-cover object-top"
                  style={{
                    filter:
                      intent === "idle"
                        ? "contrast(1.04) saturate(1.02)"
                        : "contrast(1.07) saturate(1.09) brightness(1.04)",
                    transition: "filter 700ms ease",
                    maskImage:
                      "radial-gradient(120% 100% at 50% 38%, #000 58%, rgba(0,0,0,0.82) 76%, transparent 98%)",
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* blink — eyelid flicker over the eye line */}
            {!failed && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[31%] h-[2.4%] w-[27%] -translate-x-1/2 rounded-full bg-[#1b1410] blur-[2px]"
                style={{ animation: "eyelid 7.5s ease-in-out infinite", transformOrigin: "top" }}
              />
            )}

            {/* smile warmth */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[46%] h-[9%] w-[22%] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,214,170,0.20), transparent 70%)",
                mixBlendMode: "soft-light",
              }}
              animate={{ opacity: intent === "idle" ? [0.25, 0.6, 0.25] : 0.9 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* rim light */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 55%, rgba(125,211,252,0.14) 78%, transparent 92%)",
            }}
          />
          {/* bottom fade into scene */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(180deg, transparent, #04070f 92%)" }}
          />
        </div>

        {/* status chip */}
        <motion.div
          className="glass absolute -left-4 bottom-8 flex items-center gap-2 rounded-full px-4 py-2 sm:-left-10"
          style={{ rotate: tilt }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 [animation:pulse-ring_2.4s_ease-out_infinite]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-display text-[10px] uppercase tracking-[0.22em] text-white/75">
            Available for work
          </span>
        </motion.div>

        {/* gesture layer */}
        <AnimatePresence>
          {intent === "demo" && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute -left-6 top-[52%] flex items-center gap-2"
            >
              <motion.span
                animate={{ x: [-4, 4, -4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-sky-200"
              >
                ← Right here
              </motion.span>
            </motion.div>
          )}
          {intent === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.85 }}
              className="absolute -right-4 bottom-[26%]"
            >
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-sky-200"
              >
                Built these ↘
              </motion.span>
            </motion.div>
          )}
          {intent === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 16 }}
              className="glass absolute -right-3 top-[44%] grid h-12 w-12 place-items-center rounded-2xl text-xl"
            >
              👍
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
