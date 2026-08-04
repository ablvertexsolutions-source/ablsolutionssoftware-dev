import type { ReactNode } from "react";

export const card =
  "rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]";

export const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-cyan-300/50 focus:bg-white/[0.07]";

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block font-display text-[9px] uppercase tracking-[0.28em] text-white/40">
      {children}
    </span>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 font-display text-[10px] uppercase tracking-[0.26em] text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-50"
      style={{ boxShadow: "0 18px 50px -22px rgba(37,99,235,0.9)" }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 font-display text-[10px] uppercase tracking-[0.24em] transition-all duration-300 ${
        tone === "danger"
          ? "border-rose-400/30 text-rose-300/80 hover:border-rose-400/60 hover:text-rose-200"
          : "border-white/12 text-white/65 hover:border-sky-300/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

const STATUS_TONE: Record<string, string> = {
  NEW: "border-cyan-300/40 text-cyan-200 bg-cyan-400/10",
  READ: "border-sky-300/30 text-sky-200 bg-sky-400/10",
  "IN PROGRESS": "border-amber-300/30 text-amber-200 bg-amber-400/10",
  REPLIED: "border-violet-300/30 text-violet-200 bg-violet-400/10",
  COMPLETED: "border-emerald-300/30 text-emerald-200 bg-emerald-400/10",
  ARCHIVED: "border-white/15 text-white/45 bg-white/5",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 font-display text-[9px] uppercase tracking-[0.2em] ${
        STATUS_TONE[status] ?? STATUS_TONE.ARCHIVED
      }`}
    >
      {status}
    </span>
  );
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
