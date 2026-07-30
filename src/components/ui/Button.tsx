import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { Magnetic } from "../../lib/interactions";

type Ripple = { id: number; x: number; y: number };

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  onHoverStart,
  onHoverEnd,
  cursorLabel,
  icon,
  size = "md",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  cursorLabel?: string;
  icon?: ReactNode;
  size?: "sm" | "md";
  type?: "button" | "submit";
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);

  const pad = size === "sm" ? "px-5 py-2.5 text-[11px]" : "px-7 py-4 text-[12px]";

  const skin =
    variant === "primary"
      ? "text-white border-white/15"
      : variant === "outline"
        ? "text-white/85 border-white/12"
        : "text-white/65 border-transparent";

  return (
    <Magnetic strength={0.28} className="inline-block">
      <motion.button
        type={type}
        data-cursor="button"
        data-cursor-label={cursorLabel}
        onClick={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const id = seq.current++;
          setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
          setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 750);
          onClick?.();
        }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={`group relative isolate overflow-hidden rounded-full border font-display font-semibold uppercase tracking-[0.18em] ${pad} ${skin} ${className}`}
        style={{
          background:
            variant === "primary"
              ? "linear-gradient(120deg, rgba(37,99,235,0.95), rgba(34,211,238,0.75))"
              : variant === "outline"
                ? "linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))"
                : "transparent",
          backdropFilter: variant === "ghost" ? "none" : "blur(14px)",
          boxShadow:
            variant === "primary"
              ? "0 12px 42px -12px rgba(37,99,235,0.85), inset 0 1px 0 rgba(255,255,255,0.28)"
              : "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        {/* glow ring */}
        <span
          className="pointer-events-none absolute -inset-px -z-10 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, rgba(59,130,246,0.9), rgba(34,211,238,0.65))",
          }}
        />
        {/* sweep */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span
            className="absolute inset-y-0 -left-1/3 w-1/3 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              animation: "sweep 1.15s ease-out",
            }}
          />
        </span>
        {/* ripples */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/35"
            initial={{ width: 0, height: 0, opacity: 0.55, x: r.x, y: r.y }}
            animate={{ width: 420, height: 420, opacity: 0, x: r.x - 210, y: r.y - 210 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />
        ))}
        <span className="relative flex items-center gap-2.5">
          {children}
          {icon}
        </span>
      </motion.button>
    </Magnetic>
  );
}
