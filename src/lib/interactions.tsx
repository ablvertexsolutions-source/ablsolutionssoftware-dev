import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ────────────────────────────────────────────────────────────
   Global pointer — one listener, shared motion values
   ──────────────────────────────────────────────────────────── */
type PointerCtx = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  coarse: boolean;
};

const PointerContext = createContext<PointerCtx | null>(null);

export function PointerProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nxRaw = useMotionValue(0);
  const nyRaw = useMotionValue(0);
  const nx = useSpring(nxRaw, { stiffness: 45, damping: 18, mass: 0.6 });
  const ny = useSpring(nyRaw, { stiffness: 45, damping: 18, mass: 0.6 });
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(!window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      nxRaw.set((e.clientX / window.innerWidth) * 2 - 1);
      nyRaw.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y, nxRaw, nyRaw]);

  const value = useMemo(() => ({ x, y, nx, ny, coarse }), [x, y, nx, ny, coarse]);
  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>;
}

export function usePointer() {
  const ctx = useContext(PointerContext);
  if (!ctx) throw new Error("usePointer must be used inside PointerProvider");
  return ctx;
}

/** Parallax offset driven by the global pointer. */
export function useParallax(depth: number) {
  const { nx, ny } = usePointer();
  const px = useTransform(nx, (v) => v * depth);
  const py = useTransform(ny, (v) => v * depth);
  return { px, py };
}

/* ────────────────────────────────────────────────────────────
   Magnetic wrapper
   ──────────────────────────────────────────────────────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
  radius = 1.1,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.35 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = (Math.max(r.width, r.height) / 2) * (1 + radius);
      if (dist < reach) {
        mx.set(dx * strength);
        my.set(dy * strength);
      } else {
        mx.set(0);
        my.set(0);
      }
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my, strength, radius]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   3D tilt card
   ──────────────────────────────────────────────────────────── */
export function Tilt({
  children,
  className = "",
  max = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const opacity = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 170, damping: 20 });
  const sry = useSpring(ry, { stiffness: 170, damping: 20 });

  const background = useTransform(
    [gx, gy],
    ([a, b]: number[]) =>
      `radial-gradient(420px circle at ${a}% ${b}%, rgba(120,180,255,0.16), transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
        opacity.set(1);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        opacity.set(0);
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background, opacity }}
        />
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Reveal — cinematic entrance
   ──────────────────────────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 46,
  blur = 12,
  scale = 0.985,
  once = true,
  className = "",
  duration = 1.05,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  scale?: number;
  once?: boolean;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, scale, filter: `blur(${blur}px)` }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y, scale, filter: `blur(${blur}px)` }
      }
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Word-by-word cinematic headline
   ──────────────────────────────────────────────────────────── */
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.075,
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setFallback(true);
    }, 1600);
    return () => clearTimeout(t);
  }, []);
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView || fallback ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   Count-up
   ──────────────────────────────────────────────────────────── */
export function CountUp({
  to,
  suffix = "",
  duration = 1.8,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [val, setVal] = useState(0);
  const start = useRef<number | null>(null);

  useAnimationFrame((t) => {
    if (!inView) return;
    if (start.current === null) start.current = t;
    const p = Math.min((t - start.current) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - p, 4);
    setVal(to * eased);
  });

  const display = to % 1 === 0 ? Math.round(val) : val.toFixed(1);
  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
