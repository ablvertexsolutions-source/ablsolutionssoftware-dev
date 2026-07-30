import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { CHAPTER_ONE, CHAPTER_TWO, MARQUEE } from "../lib/data";
import { Reveal, SplitWords } from "../lib/interactions";

function ChainItem({
  label,
  i,
  total,
  progress,
  accent,
}: {
  label: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
  accent: string;
}) {
  const start = 0.18 + (i / total) * 0.52;
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const x = useTransform(progress, [start, start + 0.12], [46, 0]);
  const blur = useTransform(progress, [start, start + 0.12], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const lineScale = useTransform(progress, [start, start + 0.14], [0, 1]);

  return (
    <motion.div style={{ opacity, x, filter }} className="relative pl-10">
      {/* connector */}
      <motion.span
        className="absolute left-[7px] top-0 h-full w-px origin-top"
        style={{
          scaleY: lineScale,
          background: `linear-gradient(180deg, ${accent}, transparent)`,
        }}
      />
      <span
        className="absolute left-0 top-[0.55em] grid h-[15px] w-[15px] place-items-center rounded-full border"
        style={{ borderColor: `${accent}88`, background: `${accent}1a` }}
      >
        <span
          className="h-[5px] w-[5px] rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
        />
      </span>
      <p className="py-3 font-display text-[clamp(1.35rem,3.4vw,2.6rem)] font-light leading-none tracking-[-0.02em] text-white/85">
        {label}
      </p>
    </motion.div>
  );
}

function Chapter({
  kicker,
  number,
  title,
  items,
  accent,
  align = "left",
}: {
  kicker: string;
  number: string;
  title: string;
  items: string[];
  accent: string;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const numScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 1.06]);
  const numOpacity = useTransform(scrollYProgress, [0, 0.12, 0.86, 1], [0, 1, 1, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.7, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 sm:px-8">
        <motion.div
          style={{ y: contentY }}
          className={`mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
            align === "right" ? "lg:[direction:rtl]" : ""
          }`}
        >
          <motion.div style={{ opacity: numOpacity }} className="relative [direction:ltr]">
            <motion.span
              aria-hidden
              className="absolute -inset-16 -z-10 rounded-full blur-3xl"
              style={{
                opacity: glow,
                background: `radial-gradient(circle, ${accent}55, transparent 66%)`,
              }}
            />
            <p className="font-display text-[10px] uppercase tracking-[0.42em] text-white/35">
              {kicker}
            </p>
            <motion.p
              style={{ scale: numScale }}
              className="origin-left font-display text-[clamp(6rem,20vw,14rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-gradient"
            >
              {number}
            </motion.p>
            <p className="mt-6 max-w-xs font-display text-[clamp(1rem,2vw,1.35rem)] font-light leading-snug text-white/60">
              {title}
            </p>
          </motion.div>

          <div className="space-y-1 [direction:ltr]">
            {items.map((label, i) => (
              <ChainItem
                key={label}
                label={label}
                i={i}
                total={items.length}
                progress={scrollYProgress}
                accent={accent}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Convergence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const leftX = useTransform(scrollYProgress, [0.05, 0.55], ["-14%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0.05, 0.55], ["14%", "0%"]);
  const sideOpacity = useTransform(scrollYProgress, [0.5, 0.72], [1, 0]);
  const sideBlur = useTransform(scrollYProgress, [0.5, 0.72], [0, 16]);
  const sideFilter = useTransform(sideBlur, (b) => `blur(${b}px)`);
  const mergeScale = useTransform(scrollYProgress, [0.55, 0.85], [0.85, 1]);
  const mergeOpacity = useTransform(scrollYProgress, [0.58, 0.78], [0, 1]);
  const ringScale = useTransform(scrollYProgress, [0.4, 0.9], [0.4, 1.5]);
  const ringOpacity = useTransform(scrollYProgress, [0.4, 0.7, 0.95], [0, 0.55, 0]);

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5">
        <motion.span
          className="pointer-events-none absolute h-[62vmin] w-[62vmin] rounded-full border border-cyan-300/25"
          style={{ scale: ringScale, opacity: ringOpacity }}
        />
        <motion.span
          className="pointer-events-none absolute h-[46vmin] w-[46vmin] rounded-full blur-3xl"
          style={{
            scale: ringScale,
            opacity: ringOpacity,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.42), rgba(34,211,238,0.14) 55%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-10">
            <motion.div
              style={{ x: leftX, opacity: sideOpacity, filter: sideFilter }}
              className="glass w-1/2 max-w-[280px] rounded-2xl p-5 text-left sm:p-7"
            >
              <p className="font-display text-[9px] uppercase tracking-[0.3em] text-sky-300/60">
                Chapter I
              </p>
              <p className="mt-3 font-display text-xl font-light leading-tight text-white/85 sm:text-2xl">
                Business Experience
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-white/40">
                Ledgers, payroll cycles, stock counts, month-end pressure — the real mechanics of
                running a company.
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: sideOpacity }}
              className="font-display text-2xl font-thin text-white/30"
            >
              +
            </motion.div>

            <motion.div
              style={{ x: rightX, opacity: sideOpacity, filter: sideFilter }}
              className="glass w-1/2 max-w-[280px] rounded-2xl p-5 text-left sm:p-7"
            >
              <p className="font-display text-[9px] uppercase tracking-[0.3em] text-sky-300/60">
                Chapter II
              </p>
              <p className="mt-3 font-display text-xl font-light leading-tight text-white/85 sm:text-2xl">
                Modern Engineering
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-white/40">
                React, TypeScript, Python, Supabase and AI agents — shipped, deployed, in daily
                use.
              </p>
            </motion.div>
          </div>

          <motion.div
            style={{ scale: mergeScale, opacity: mergeOpacity }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          >
            <p className="font-display text-[10px] uppercase tracking-[0.46em] text-cyan-300/70">
              Chapter III
            </p>
            <h3 className="mt-5 font-display text-[clamp(2rem,7vw,5rem)] font-extralight leading-[0.95] tracking-[-0.04em]">
              <span className="text-gradient">Modern </span>
              <span className="text-gradient-blue">AI Business</span>
              <br />
              <span className="text-gradient">Solutions</span>
            </h3>
            <p className="mx-auto mt-7 max-w-lg text-[14px] leading-relaxed text-white/45">
              Twenty years of knowing exactly where a business bleeds time — encoded into software
              that fixes it. That intersection is the whole practice.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-6">
      <div className="animate-ticker flex w-max gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-[clamp(1rem,2.4vw,1.7rem)] font-extralight uppercase tracking-[0.12em] text-white/22">
              {t}
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-300/50" />
          </span>
        ))}
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#04070f] to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#04070f] to-transparent" />
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative">
      <div className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-display text-[10px] uppercase tracking-[0.46em] text-sky-300/50">
              The Story
            </p>
          </Reveal>
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(1.9rem,5.4vw,4rem)] font-extralight leading-[1.05] tracking-[-0.035em] text-white/90">
            <SplitWords text="Two careers, one operating system for business." stagger={0.045} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/45">
              Scroll through the two decades that built the judgement, and the three years that
              built the tooling.
            </p>
          </Reveal>
        </div>
      </div>

      <Marquee />

      <Chapter
        kicker="Chapter One"
        number="20+"
        title="Years of Business Experience"
        items={CHAPTER_ONE}
        accent="#3b82f6"
      />

      <Chapter
        kicker="Chapter Two"
        number="3+"
        title="Years of Modern Software Development"
        items={CHAPTER_TWO}
        accent="#22d3ee"
        align="right"
      />

      <Convergence />
    </section>
  );
}
