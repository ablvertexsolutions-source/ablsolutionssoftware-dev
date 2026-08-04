import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_IMAGE = "/images/intro-car.jpg";

/** 5-second cinematic ABL VERTEX splash — plays on every load. */
export default function Splash({
  image,
  onDone,
}: {
  image?: string | null;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 5000);
    const d = setTimeout(onDone, 5700);
    return () => {
      clearTimeout(t);
      clearTimeout(d);
    };
  }, [onDone]);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 1 + Math.random() * 2,
        d: 4 + Math.random() * 5,
        delay: Math.random() * 3,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#02040a]"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: [0, 0.9, 0.9, 0.7], scale: [1.14, 1.04, 1.02, 1.08] }}
            transition={{ duration: 5, times: [0, 0.2, 0.7, 1], ease: "easeInOut" }}
          >
            <img
              src={image || DEFAULT_IMAGE}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.7) saturate(1.15) contrast(1.08)" }}
            />
          </motion.div>

          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 55%, rgba(37,99,235,0.28), transparent 70%), radial-gradient(120% 100% at 50% 120%, rgba(2,4,10,0.9), transparent 60%), linear-gradient(180deg, rgba(2,4,10,0.85), transparent 35%, rgba(2,4,10,0.9))",
            }}
          />

          {particles.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden
              className="absolute rounded-full bg-sky-200/60"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -60] }}
              transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          <div className="absolute inset-0 grid place-items-center px-6">
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.6em", filter: "blur(14px)" }}
              animate={{ opacity: 1, letterSpacing: "0.3em", filter: "blur(0px)" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-center font-display text-[clamp(1.6rem,7vw,4.6rem)] font-extralight tracking-[0.3em] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #cfe4ff 40%, #4d90e0 70%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              ABL VERTEX
            </motion.div>
          </div>

          <motion.div
            aria-hidden
            className="absolute bottom-0 left-1/2 h-px w-[42vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-300/60 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
