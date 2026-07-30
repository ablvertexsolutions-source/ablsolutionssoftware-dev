import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { NAV, PROFILE } from "../lib/data";
import { scrollToSection, useActiveSection } from "../lib/smooth";
import Button from "./ui/Button";

const IDS = NAV.map((n) => n.id);

export default function Nav({ onDemo }: { onDemo: () => void }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    if (open) return;
    setHidden(y > prev && y > 180);
  });

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-blue-600 via-cyan-300 to-blue-500"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header
        initial={{ y: -110, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 sm:px-7 sm:pt-6"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-700 sm:px-6 ${
            solid ? "glass shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]" : "border border-transparent"
          }`}
        >
          <button
            onClick={() => go("hero")}
            data-cursor="button"
            className="group flex items-center gap-3"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-blue-600/40 to-cyan-400/20">
              <span className="font-display text-[12px] font-bold tracking-tight text-white">
                {PROFILE.initials}
              </span>
              <span className="absolute inset-0 rounded-xl opacity-0 blur-md transition group-hover:opacity-100 bg-blue-500/40" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block font-display text-[13px] font-semibold tracking-[0.14em] text-white">
                {PROFILE.name.toUpperCase()}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-sky-300/50">
                {PROFILE.role}
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                data-cursor="button"
                className="relative rounded-full px-4 py-2 font-display text-[11px] uppercase tracking-[0.2em] transition-colors"
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative transition-colors ${
                    active === n.id ? "text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {n.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button size="sm" onClick={onDemo}>
                Request a Demo
              </Button>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              data-cursor="button"
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] md:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  className="absolute left-0 top-0 h-px w-full bg-white"
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="absolute left-0 top-1.5 h-px w-full bg-white"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="absolute left-0 top-3 h-px w-full bg-white"
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-deep fixed inset-0 z-[95] flex flex-col justify-center px-8 md:hidden"
          >
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                onClick={() => go(n.id)}
                initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.06 * i + 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/[0.06] py-5 text-left font-display text-4xl font-light tracking-tight text-white/90"
              >
                <span className="mr-4 text-[11px] tracking-[0.3em] text-sky-400/60">
                  0{i + 1}
                </span>
                {n.label}
              </motion.button>
            ))}
            <div className="mt-10">
              <Button
                onClick={() => {
                  setOpen(false);
                  onDemo();
                }}
              >
                Request a Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
