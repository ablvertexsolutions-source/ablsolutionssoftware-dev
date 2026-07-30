import { motion } from "framer-motion";
import { SKILLS } from "../lib/data";
import { Reveal, SplitWords } from "../lib/interactions";

function Capsule({ name, tint, glyph, i }: { name: string; tint: string; glyph: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: (i % 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="[perspective:900px]"
    >
      <motion.div
        data-cursor="card"
        animate={{ y: [0, i % 2 === 0 ? -9 : -5, 0] }}
        transition={{
          duration: 5 + (i % 5) * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.18,
        }}
        whileHover={{ scale: 1.09, rotateX: -8, rotateY: 10, y: -12 }}
        className="glass group relative flex items-center gap-3 rounded-full px-5 py-3.5 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${tint}66, transparent 70%)` }}
        />
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold"
          style={{
            background: `${tint}22`,
            color: tint,
            border: `1px solid ${tint}44`,
            boxShadow: `inset 0 0 12px ${tint}22`,
          }}
        >
          {glyph}
        </span>
        <span className="whitespace-nowrap font-display text-[12px] font-medium tracking-[0.1em] text-white/80 transition-colors group-hover:text-white">
          {name}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 30px -6px ${tint}` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative border-t border-white/[0.05] px-5 py-28 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[110px]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="font-display text-[10px] uppercase tracking-[0.46em] text-sky-300/50">
            Toolchain
          </p>
        </Reveal>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(1.9rem,5.4vw,4rem)] font-extralight leading-[1.05] tracking-[-0.035em] text-white/90">
            <SplitWords text="The stack behind the systems." stagger={0.05} />
          </h2>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-[14px] leading-relaxed text-white/40">
              Engineering tools, accounting platforms and AI studios — chosen for shipping speed,
              not for show.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3.5 sm:gap-4">
          {SKILLS.map((s, i) => (
            <Capsule key={s.name} {...s} i={i} />
          ))}
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          {[
            ["Engineering", "React · TypeScript · Python · Supabase", "Production apps with auth, RLS, realtime and clean data models."],
            ["AI Delivery", "Claude Code · Cursor · OpenAI · Lovable", "Agentic workflows that compress build cycles from months to weeks."],
            ["Business Core", "QuickBooks · Xero · Ops · Inventory", "Two decades of ledgers, controls and close cycles behind every feature."],
          ].map(([title, tools, copy], i) => (
            <Reveal key={title} delay={i * 0.12}>
              <div
                data-cursor="card"
                className="glass group h-full rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-2"
                style={{ boxShadow: "0 30px 70px -50px rgba(0,0,0,1)" }}
              >
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-sky-300/55">
                  {title}
                </p>
                <p className="mt-4 font-display text-[15px] font-light leading-snug text-white/85">
                  {tools}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/40">{copy}</p>
                <span className="mt-6 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-300/70 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
