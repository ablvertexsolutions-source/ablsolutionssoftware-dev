import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type Variant = "default" | "button" | "card" | "video" | "text" | "hidden";

const SPEC: Record<Variant, { size: number; border: string; bg: string; blend: string }> = {
  default: { size: 34, border: "rgba(125,211,252,0.85)", bg: "rgba(59,130,246,0.06)", blend: "normal" },
  button: { size: 74, border: "rgba(125,211,252,0.55)", bg: "rgba(59,130,246,0.16)", blend: "normal" },
  card: { size: 56, border: "rgba(148,197,255,0.45)", bg: "rgba(59,130,246,0.10)", blend: "normal" },
  video: { size: 104, border: "rgba(125,211,252,0.65)", bg: "rgba(8,20,42,0.42)", blend: "normal" },
  text: { size: 12, border: "rgba(125,211,252,0.9)", bg: "rgba(125,211,252,0.9)", blend: "normal" },
  hidden: { size: 0, border: "transparent", bg: "transparent", blend: "normal" },
};

export default function Cursor() {
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const dx = useMotionValue(-200);
  const dy = useMotionValue(-200);

  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.42 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.42 });
  const dotX = useSpring(dx, { stiffness: 1100, damping: 46, mass: 0.2 });
  const dotY = useSpring(dy, { stiffness: 1100, damping: 46, mass: 0.2 });

  const spec = SPEC[variant];
  const size = useMotionValue(spec.size);
  const sizeSpring = useSpring(size, { stiffness: 320, damping: 26 });
  // combine follow position + half-size offset into a single transform
  const posX = useTransform([ringX, sizeSpring], ([p, s]: number[]) => p - s / 2);
  const posY = useTransform([ringY, sizeSpring], ([p, s]: number[]) => p - s / 2);

  useEffect(() => {
    size.set(down ? spec.size * 0.86 : spec.size);
  }, [spec.size, size, down]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      dx.set(e.clientX);
      dy.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const node = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (node) {
        setVariant((node.dataset.cursor as Variant) || "default");
        setLabel(node.dataset.cursorLabel || "");
      } else {
        const interactive = target?.closest?.("a,button,input,textarea,select");
        setVariant(interactive ? "button" : "default");
        setLabel("");
      }
    };

    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVariant("hidden");
    const onEnter = () => setVariant("default");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [x, y, dx, dy]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150]">
      {/* halo */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: posX,
          y: posY,
          width: sizeSpring,
          height: sizeSpring,
          border: `1px solid ${spec.border}`,
          background: spec.bg,
          backdropFilter: variant === "default" ? "none" : "blur(6px) saturate(140%)",
          boxShadow: `0 0 26px rgba(59,130,246,0.45), inset 0 0 22px rgba(125,211,252,0.14)`,
          opacity: variant === "hidden" ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full w-full items-center justify-center text-center font-display text-[9px] font-semibold uppercase leading-tight tracking-[0.18em] text-white"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* core dot */}
      <motion.div
        className="absolute -left-[2.5px] -top-[2.5px] h-[5px] w-[5px] rounded-full bg-sky-200"
        style={{
          x: dotX,
          y: dotY,
          boxShadow: "0 0 14px rgba(125,211,252,1)",
          opacity: variant === "hidden" || label ? 0 : 1,
        }}
      />
    </div>
  );
}
