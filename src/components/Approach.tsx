import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, SplitWords } from "../lib/interactions";

const STEPS = [
  {
    n: "01",
    title: "Sit inside the operation",
    copy: "I map the actual workflow — who touches what, where the spreadsheet lives, which reconciliation eats the week.",
  },
  {
    n: "02",
    title: "Design the shortest path",
    copy: "Data model first, interface second. The system should encode the judgement, not just record the outcome.",
  },
  {
    n: "03",
    title: "Ship, measure, compound",
    copy: "Deployed in weeks with AI-accelerated build cycles, then tuned against real numbers until the hours come back.",
  },
];

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0.15, 0.8], [0, 1]);
  const quoteOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);
  const quoteY = useTransform(scrollYProgress, [0.05, 0.5], [60, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/[0.05] px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <motion.blockquote
          style={{ opacity: quoteOpacity, y: quoteY }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="font-serif text-[clamp(1.6rem,4.6vw,3.4rem)] italic leading-[1.15] tracking-[-0.02em] text-white/80">
            “Great software begins with understanding the business—not writing code. I listen
            carefully to your team's challenges, identify the operational pain points, and
            <span className="text-gradient-blue">
              {" "}
              design practical systems that automate workflows, improve efficiency, and create
              measurable business value.
            </span>
            ”
          </p>
          <footer className="mt-8 font-display text-[10px] uppercase tracking-[0.36em] text-white/30">
            Adrian Llano · Business Systems Philosophy
          </footer>
        </motion.blockquote>

        <div className="relative mt-28">
          <span className="absolute left-0 right-0 top-[14px] hidden h-px bg-white/[0.07] md:block" />
          <motion.span
            className="absolute left-0 right-0 top-[14px] hidden h-px origin-left bg-gradient-to-r from-blue-500 via-cyan-300 to-transparent md:block"
            style={{ scaleX: lineScale }}
          />

          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.14} y={40}>
                <div data-cursor="card" className="group relative">
                  <span
                    className="relative z-10 mb-7 grid h-7 w-7 place-items-center rounded-full border border-cyan-300/40 bg-[#04070f] font-display text-[9px] tracking-[0.1em] text-cyan-300 transition-all duration-500 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.6)]"
                    style={{ display: "grid" }}
                  >
                    {s.n}
                  </span>
                  <h3 className="font-display text-[clamp(1.15rem,2.4vw,1.6rem)] font-light leading-snug tracking-tight text-white/90">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/40">
                    {s.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-28 grid gap-8 border-t border-white/[0.06] pt-14 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="max-w-2xl font-display text-[clamp(1.6rem,4.2vw,3rem)] font-extralight leading-[1.08] tracking-[-0.03em] text-white/85">
            <SplitWords
              text="The result: software that pays for itself inside a quarter."
              stagger={0.04}
            />
          </h2>
          <Reveal delay={0.2}>
            <div className="flex gap-10">
              {[
                ["4", "Systems live"],
                ["100%", "Owner-tested"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl font-light tracking-tight text-gradient-blue">
                    {v}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
