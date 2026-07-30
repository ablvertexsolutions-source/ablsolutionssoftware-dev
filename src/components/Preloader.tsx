import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const PHASES = [
  "Initialising environment",
  "Loading neural mesh",
  "Compiling systems",
  "Calibrating experience",
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const MIN = 2100;
    const tick = (t: number) => {
      const elapsed = t - start;
      const timeP = Math.min(elapsed / MIN, 1);
      const docReady = document.readyState === "complete" ? 1 : 0.86;
      const target = Math.min(timeP, docReady) * 100;
      setProgress((p) => Math.max(p, p + (target - p) * 0.09));
      if (elapsed < MIN + 900 && target < 99.6) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => setExiting(true), 420);
        setTimeout(onDone, 1500);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [onDone]);

  const pct = Math.round(progress);
  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((pct / 100) * PHASES.length))];

  const motes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 3 + 1,
        d: Math.random() * 5 + 4,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#04070f]"
          exit={{ opacity: 0, filter: "blur(18px)", scale: 1.06 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* energy field */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.30) 0%, rgba(34,211,238,0.10) 38%, transparent 68%)",
              }}
              animate={{ scale: [0.85, 1.08, 0.85], opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {motes.map((m) => (
              <motion.span
                key={m.id}
                className="absolute rounded-full bg-sky-300"
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  width: m.s,
                  height: m.s,
                  boxShadow: "0 0 12px rgba(96,165,250,0.9)",
                }}
                animate={{ y: [0, -70, 0], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: m.d,
                  delay: m.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative flex w-[min(88vw,440px)] flex-col items-center">
            {/* animated monogram */}
            <motion.svg
              width="132"
              height="132"
              viewBox="0 0 120 120"
              fill="none"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="55%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#pg)"
                strokeWidth="0.8"
                strokeOpacity="0.35"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "60px 60px" }}
                strokeDasharray="3 9"
              />
              <motion.path
                d="M60 12 L60 108"
                stroke="url(#pg)"
                strokeWidth="0.6"
                strokeOpacity="0.18"
                animate={{ rotate: -360 }}
                transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "60px 60px" }}
              />
              {/* A */}
              <motion.path
                d="M30 84 L46 36 L62 84 M36 70 L56 70"
                stroke="url(#pg)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />
              {/* L */}
              <motion.path
                d="M74 36 L74 84 L92 84"
                stroke="url(#pg)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9 }}
              className="mt-7 text-center"
            >
              <p className="font-display text-[13px] font-medium uppercase tracking-[0.55em] text-white/80">
                Adrian Llano
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-sky-300/50">
                AI Business Systems
              </p>
            </motion.div>

            {/* progress */}
            <div className="mt-12 w-full">
              <div className="relative h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-400"
                  style={{ width: `${pct}%` }}
                />
                <motion.div
                  className="absolute inset-y-[-3px] w-16 blur-[6px]"
                  style={{
                    left: `${pct}%`,
                    background:
                      "radial-gradient(circle, rgba(125,211,252,0.95), transparent 70%)",
                  }}
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between font-display text-[11px] uppercase tracking-[0.24em]">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/45"
                >
                  {phase}
                </motion.span>
                <span className="tabular-nums text-white/85">
                  {String(pct).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* exit curtains */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 origin-bottom bg-[#04070f]"
            initial={{ scaleY: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
