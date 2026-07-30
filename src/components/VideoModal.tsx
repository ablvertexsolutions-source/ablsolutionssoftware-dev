import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../lib/data";
import { lockScroll } from "../lib/smooth";
import { SCREENS } from "./devices/Screens";

export default function VideoModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!project) return;
    setMissing(false);
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => videoRef.current?.play().catch(() => {}), 260);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      lockScroll(false);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    };
  }, [project, onClose]);

  const Screen = project ? SCREENS[project.id] : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#04070f]/80"
            style={{ backdropFilter: "blur(22px) saturate(140%)" }}
            onClick={onClose}
            data-cursor="button"
            data-cursor-label="Close"
          />

          <motion.div
            ref={shellRef}
            initial={{ opacity: 0, y: 46, scale: 0.94, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(12px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-deep relative w-full max-w-5xl overflow-hidden rounded-3xl"
            style={{ boxShadow: "0 60px 140px -40px rgba(0,0,0,0.95)" }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <p className="font-display text-[9px] uppercase tracking-[0.32em] text-sky-300/60">
                  Demo · {project.category}
                </p>
                <p className="truncate font-display text-lg font-light tracking-tight text-white">
                  {project.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => shellRef.current?.requestFullscreen?.().catch(() => {})}
                  data-cursor="button"
                  className="glass grid h-9 w-9 place-items-center rounded-xl text-white/70 transition hover:text-white"
                  aria-label="Fullscreen"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  data-cursor="button"
                  className="glass grid h-9 w-9 place-items-center rounded-xl text-white/70 transition hover:text-white"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {!missing ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src={project.video}
                  controls
                  playsInline
                  preload="metadata"
                  onError={() => setMissing(true)}
                />
              ) : (
                <div className="relative h-full w-full">
                  {Screen && (
                    <div className="absolute inset-0 opacity-45">
                      <Screen />
                    </div>
                  )}
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-[#04070f] via-[#04070f]/70 to-transparent px-6 text-center">
                    <div>
                      <motion.span
                        className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-cyan-300/40"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.6, repeat: Infinity }}
                      >
                        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />
                      </motion.span>
                      <p className="font-display text-sm uppercase tracking-[0.3em] text-white/80">
                        Live walkthrough
                      </p>
                      <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-white/45">
                        Drop <code className="text-cyan-300/80">{project.video}</code> into your
                        repo and this modal streams it instantly — GitHub and Vercel ready.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 sm:px-7">
              {project.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-light text-white">
                    {s.value}
                    {s.suffix}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
