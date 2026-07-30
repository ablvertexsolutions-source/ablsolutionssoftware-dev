import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { PROFILE } from "../lib/data";
import { SplitWords, useParallax } from "../lib/interactions";
import { downloadResume } from "../lib/resume";
import { scrollToSection } from "../lib/smooth";
import Portrait, { type Intent } from "./Portrait";
import Button from "./ui/Button";
import { IPhone, MacBook, Monitor, Tablet } from "./devices/Devices";
import { ConverterScreen, FuelScreen, PayrollScreen, ResortScreen } from "./devices/Screens";

function Floating({
  children,
  depth,
  className = "",
  rotate = 0,
  rotateY = 0,
  duration = 8,
  delay = 0,
  z = 0,
}: {
  children: ReactNode;
  depth: number;
  className?: string;
  rotate?: number;
  rotateY?: number;
  duration?: number;
  delay?: number;
  z?: number;
}) {
  const { px, py } = useParallax(depth);
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ x: px, y: py, zIndex: z }}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -16, 0], rotateZ: [rotate - 0.6, rotate + 0.6, rotate - 0.6] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        style={{
          rotateY,
          transformPerspective: 1600,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ onDemo }: { onDemo: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [intent, setIntent] = useState<Intent>("idle");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-32 sm:px-8 lg:pt-28"
    >
      <motion.div
        style={{ scale, opacity, filter, y }}
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8"
      >
        {/* ── copy ─────────────────────────────────── */}
        <div className="relative z-10 lg:col-span-6 xl:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="glass inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-4"
          >
            <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-3 py-1 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white">
              20 + 3
            </span>
            <span className="font-display text-[10px] uppercase tracking-[0.26em] text-white/60">
              Business years × Engineering years
            </span>
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(2.6rem,7.2vw,5.1rem)] font-light leading-[0.94] tracking-[-0.035em]">
            <span className="block text-gradient">
              <SplitWords text="Helping Businesses" delay={0.25} />
            </span>
            <span className="block text-gradient">
              <SplitWords text="Work Smarter" delay={0.34} />
            </span>
            <span className="block">
              <span className="text-gradient-blue">
                <SplitWords text="Through Custom Software" delay={0.46} />
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-md text-[15px] leading-relaxed text-white/55"
          >
            {PROFILE.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button
              onClick={onDemo}
              onHoverStart={() => setIntent("demo")}
              onHoverEnd={() => setIntent("idle")}
            >
              Request a Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("work")}
              onHoverStart={() => setIntent("projects")}
              onHoverEnd={() => setIntent("idle")}
            >
              View Projects
            </Button>
            <Button
              variant="ghost"
              onClick={downloadResume}
              onHoverStart={() => setIntent("resume")}
              onHoverEnd={() => setIntent("idle")}
            >
              Download Résumé
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.25 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/[0.07] pt-6"
          >
            {[
              ["20+", "Years in business ops"],
              ["4", "Production systems"],
              ["3+", "Years engineering"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-light tracking-tight text-white">{v}</p>
                <p className="mt-1 text-[10px] uppercase leading-tight tracking-[0.16em] text-white/35">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── portrait + device ecosystem ───────────── */}
        <div className="relative lg:col-span-6 xl:col-span-7">
          <div
            className="relative mx-auto aspect-[4/3.9] w-full max-w-[540px] lg:max-w-[620px]"
            style={{ perspective: "1800px", transformStyle: "preserve-3d" }}
          >
            {/* MacBook · ABL Payroll */}
            <Floating
              depth={26}
              rotateY={17}
              rotate={-3}
              duration={9}
              delay={0.5}
              z={1}
              className="hidden w-[52%] left-[-14%] top-[14%] md:block"
            >
              <MacBook>
                <PayrollScreen />
              </MacBook>
              <DeviceTag label="ABL Payroll" />
            </Floating>

            {/* Monitor · Serenity Resort */}
            <Floating
              depth={16}
              rotateY={-16}
              rotate={2}
              duration={11}
              delay={0.68}
              z={1}
              className="hidden w-[48%] right-[-12%] top-[4%] md:block"
            >
              <Monitor>
                <ResortScreen />
              </Monitor>
              <DeviceTag label="Serenity Resort" align="right" />
            </Floating>

            {/* Tablet · QuickBooks Converter */}
            <Floating
              depth={38}
              rotateY={12}
              rotate={-2}
              duration={10}
              delay={0.86}
              z={3}
              className="hidden w-[36%] left-[-8%] bottom-[6%] md:block"
            >
              <Tablet>
                <ConverterScreen />
              </Tablet>
              <DeviceTag label="QB Converter" />
            </Floating>

            {/* iPhone · Fuel Saver */}
            <Floating
              depth={52}
              rotateY={-12}
              rotate={4}
              duration={7.5}
              delay={1}
              z={4}
              className="w-[22%] right-[2%] bottom-[4%] sm:w-[19%] md:right-[6%]"
            >
              <IPhone>
                <FuelScreen />
              </IPhone>
              <DeviceTag label="Fuel Saver" align="right" />
            </Floating>

            {/* portrait */}
            <div className="absolute inset-x-[16%] top-[6%] z-[2] md:inset-x-[22%]">
              <Portrait intent={intent} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-display text-[9px] uppercase tracking-[0.42em] text-white/30">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-sky-300 to-transparent"
            animate={{ y: [-18, 50] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

function DeviceTag({ label, align = "left" }: { label: string; align?: "left" | "right" }) {
  return (
    <div
      className={`glass absolute -bottom-6 whitespace-nowrap rounded-full px-3 py-1 font-display text-[8px] uppercase tracking-[0.2em] text-white/60 ${
        align === "right" ? "right-2" : "left-2"
      }`}
    >
      <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-cyan-300 align-middle" />
      {label}
    </div>
  );
}
