import { motion } from "framer-motion";
import { NAV, PROFILE } from "../lib/data";
import { Reveal, SplitWords } from "../lib/interactions";
import { scrollToSection } from "../lib/smooth";
import { downloadResume } from "../lib/resume";
import { DemoForm } from "./DemoForm";
import Button from "./ui/PremiumButton";

export default function Contact({ onDemo }: { onDemo: () => void }) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/[0.05] px-5 py-28 sm:px-8 sm:py-36"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[70vmin] w-[110vmin] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.24), rgba(34,211,238,0.08) 50%, transparent 72%)",
        }}
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-display text-[10px] uppercase tracking-[0.46em] text-sky-300/50">
              Contact
            </p>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.1rem,6vw,4.4rem)] font-extralight leading-[1] tracking-[-0.04em] text-gradient">
            <SplitWords text="Let’s build the system your business is missing." stagger={0.045} />
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/45">
              I listen to the problems businesses face, identify operational pain points, and turn
              those challenges into practical software solutions.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/45">
              Tell me what is slowing your business down, what your team is doing manually, or where
              your current systems are falling short. I’ll help you explore a smarter way to solve
              it.
            </p>
          </Reveal>

          <div className="mt-10 space-y-3">
            {CONTACTS.map((c, i) => (
              <Reveal key={c.label} delay={0.08 * i}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor="button"
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] px-4 py-3 transition-colors hover:border-cyan-300/30"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-sky-300/80 transition-colors group-hover:text-cyan-300">
                    <ContactIcon name={c.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[9px] uppercase tracking-[0.3em] text-white/30">
                      {c.label}
                    </span>
                    <span className="mt-1 block truncate font-display text-[14px] text-white/85 transition-colors group-hover:text-cyan-300">
                      {c.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="outline" onClick={downloadResume}>
                Download Résumé
              </Button>
              <Button variant="ghost" onClick={onDemo}>
                Contact Me
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={60}>
          <div
            className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9"
            style={{ boxShadow: "0 50px 120px -60px rgba(0,0,0,1)" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/15 blur-[70px]"
            />
            <div className="relative">
              <p className="font-display text-[9px] uppercase tracking-[0.34em] text-sky-300/60">
                Software Demo Request
              </p>
              <p className="mt-3 font-display text-xl font-light tracking-tight text-white/90">
                Tell me what you run today.
              </p>
              <div className="mt-7">
                <DemoForm />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-sky-300/45">
              {PROFILE.role}
            </p>
            <h3 className="mt-4 font-display text-[clamp(2.6rem,11vw,8rem)] font-extralight leading-[0.85] tracking-[-0.05em] text-gradient">
              Adrian Llano
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-cursor="button"
                onClick={() => scrollToSection(n.id)}
                className="font-display text-[11px] uppercase tracking-[0.24em] text-white/40 transition-colors hover:text-white"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <p className="text-[11px] tracking-[0.1em] text-white/25">
            © {new Date().getFullYear()} {PROFILE.name}. Built with React, Three.js & Framer Motion.
          </p>
          <button
            data-cursor="button"
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40 transition-colors hover:text-white"
          >
            Back to top
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
