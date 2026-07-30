import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROJECTS, type Project } from "../lib/data";
import { CountUp, Reveal, SplitWords, Tilt } from "../lib/interactions";
import Button from "./ui/Button";
import { IPhone, MacBook, Monitor, Tablet } from "./devices/Devices";
import { SCREENS } from "./devices/Screens";

const FRAMES = { macbook: MacBook, monitor: Monitor, tablet: Tablet, iphone: IPhone };

function ProjectScene({
  project,
  index,
  onWatch,
  onDemo,
}: {
  project: Project;
  index: number;
  onWatch: (p: Project) => void;
  onDemo: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const visualRotate = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.55, 0.1]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const flipped = index % 2 === 1;
  const Frame = FRAMES[project.device];
  const Screen = SCREENS[project.id];
  const isPhone = project.device === "iphone";

  return (
    <div
      ref={ref}
      className="relative border-t border-white/[0.05] px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      {/* ambient project glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle, ${project.accent}44, transparent 68%)`,
        }}
      />
      {/* ghost index */}
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className={`pointer-events-none absolute top-8 select-none font-display text-[26vw] font-extralight leading-none text-white/[0.022] ${
          flipped ? "right-0" : "left-0"
        }`}
      >
        {project.index}
      </motion.span>

      <div
        className={`relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20 ${
          flipped ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* ── copy ─────────────────────────────── */}
        <div className="[direction:ltr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <span
                className="font-display text-[11px] font-semibold tracking-[0.3em]"
                style={{ color: project.accent }}
              >
                {project.index}
              </span>
              <span className="h-px w-10" style={{ background: `${project.accent}66` }} />
              <span className="font-display text-[10px] uppercase tracking-[0.28em] text-white/40">
                {project.category}
              </span>
            </div>
          </Reveal>

          <h3 className="mt-6 font-display text-[clamp(2.2rem,6vw,4.4rem)] font-extralight leading-[0.95] tracking-[-0.04em] text-gradient">
            <SplitWords text={project.name} stagger={0.07} />
          </h3>

          <Reveal delay={0.12}>
            <p className="mt-4 font-serif text-[clamp(1.1rem,2.4vw,1.7rem)] italic leading-snug text-white/55">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 max-w-lg text-[14.5px] leading-relaxed text-white/45">
              {project.description}
            </p>
          </Reveal>

          {/* stack */}
          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((s, i) => (
              <Reveal key={s} delay={0.24 + i * 0.06} y={18} blur={6}>
                <span
                  className="glass rounded-full px-3.5 py-1.5 font-display text-[10px] uppercase tracking-[0.16em] text-white/65"
                  style={{ borderColor: `${project.accent}33` }}
                >
                  {s}
                </span>
              </Reveal>
            ))}
          </div>

          {/* features */}
          <ul className="mt-8 space-y-3">
            {project.features.map((f, i) => (
              <Reveal key={f} delay={0.3 + i * 0.08} y={22} blur={7}>
                <li className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/55">
                  <span
                    className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full"
                    style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
                  />
                  {f}
                </li>
              </Reveal>
            ))}
          </ul>

          {/* stats */}
          <div className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-white/[0.07] pt-7">
            {project.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.2 + i * 0.1}>
                <div>
                  <p className="font-display text-[clamp(1.4rem,3vw,2.1rem)] font-light leading-none tracking-tight text-white">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-[10px] uppercase leading-tight tracking-[0.16em] text-white/35">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={() => onWatch(project)} cursorLabel="Play">
                Watch Demo Video
              </Button>
              <Button variant="outline" onClick={onDemo}>
                Request a Demo
              </Button>
            </div>
          </Reveal>
        </div>

        {/* ── visual ───────────────────────────── */}
        <motion.div style={{ y: visualY }} className="relative [direction:ltr]">
          <Tilt
            className="relative"
            max={7}
            glare={false}
          >
            <motion.div
              style={{ rotate: visualRotate }}
              className={`relative mx-auto ${isPhone ? "max-w-[260px]" : "max-w-[640px]"}`}
              data-cursor="card"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <Frame>
                  <Screen />
                </Frame>
              </motion.div>

              {/* companion phone for desktop-first products */}
              {!isPhone && (
                <motion.div
                  className="absolute -bottom-10 -right-4 w-[22%] sm:-right-10 sm:w-[20%]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >
                  <IPhone>
                    <Screen />
                  </IPhone>
                </motion.div>
              )}

              {/* play affordance */}
              <button
                onClick={() => onWatch(project)}
                data-cursor="video"
                data-cursor-label="Play Demo"
                aria-label={`Watch ${project.name} demo`}
                className="group absolute inset-0 grid place-items-center"
              >
                <span
                  className="grid h-16 w-16 place-items-center rounded-full border border-white/25 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100"
                  style={{ background: "rgba(4,7,15,0.45)" }}
                >
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="white">
                    <path d="M0 0l16 9L0 18z" />
                  </svg>
                </span>
              </button>
            </motion.div>
          </Tilt>

          {/* reflection */}
          <div
            aria-hidden
            className="pointer-events-none mx-auto mt-6 h-24 max-w-[560px] opacity-30 blur-[3px]"
            style={{
              background: `radial-gradient(ellipse at top, ${project.accent}55, transparent 70%)`,
              maskImage: "linear-gradient(180deg, #000, transparent)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects({
  onWatch,
  onDemo,
}: {
  onWatch: (p: Project) => void;
  onDemo: () => void;
}) {
  return (
    <section id="work" className="relative">
      <div className="px-5 pb-8 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="font-display text-[10px] uppercase tracking-[0.46em] text-sky-300/50">
              Selected Work
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-3xl font-display text-[clamp(1.9rem,5.4vw,4rem)] font-extralight leading-[1.05] tracking-[-0.035em] text-white/90">
              <SplitWords text="Four systems, in daily production use." stagger={0.05} />
            </h2>
            <Reveal delay={0.2}>
              <p className="max-w-xs text-[14px] leading-relaxed text-white/40">
                Each one started as a real operational problem I lived through — then became
                software.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectScene key={p.id} project={p} index={i} onWatch={onWatch} onDemo={onDemo} />
      ))}
    </section>
  );
}
