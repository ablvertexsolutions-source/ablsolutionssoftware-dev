import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { PROFILE, PROJECTS } from "../lib/data";
import { lockScroll } from "../lib/smooth";
import Button from "./ui/PremiumButton";

const SYSTEMS = [...PROJECTS.map((p) => p.name), "Custom business system"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[9px] uppercase tracking-[0.28em] text-white/40">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-cyan-300/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]";

export function DemoForm({ onSent }: { onSent?: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    system: SYSTEMS[0],
    message: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `System of interest: ${form.system}`,
      "",
      form.message,
      "",
      "— Sent from adrianllano.dev",
    ].join("\n");

    const url = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      "Software Demo Request"
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    window.setTimeout(() => {
      window.location.href = url;
      onSent?.();
    }, 700);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            onSubmit={submit}
            exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Cooper"
                  className={inputCls}
                />
              </Field>
              <Field label="Work email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="jane@company.com"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company">
                <input
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Northwind Group"
                  className={inputCls}
                />
              </Field>
              <Field label="System of interest">
                <select value={form.system} onChange={set("system")} className={inputCls}>
                  {SYSTEMS.map((s) => (
                    <option key={s} value={s} className="bg-[#0b1222]">
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="What would you like to see?">
              <textarea
                rows={4}
                value={form.message}
                onChange={set("message")}
                placeholder="We run payroll for 60 staff across two entities and month-end takes a week…"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="max-w-[15rem] text-[11px] leading-relaxed text-white/30">
                Submitting opens your mail client with the request pre-written.
              </p>
              <Button type="submit" cursorLabel="Send">
                Send Request
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="py-10 text-center"
          >
            <motion.span
              className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-cyan-300/40"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2">
                <path d="m4 12 5 5L20 6" />
              </svg>
            </motion.span>
            <p className="font-display text-xl font-light tracking-tight text-white">
              Opening your mail client…
            </p>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-white/45">
              If nothing happens, email{" "}
              <a href={`mailto:${PROFILE.email}`} className="text-cyan-300/90 underline-offset-4 hover:underline">
                {PROFILE.email}
              </a>{" "}
              with the subject “Software Demo Request”.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto p-4 py-10 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="fixed inset-0 bg-[#04070f]/80"
            style={{ backdropFilter: "blur(24px) saturate(140%)" }}
            onClick={onClose}
            data-cursor="button"
            data-cursor-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(12px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-deep relative w-full max-w-2xl overflow-hidden rounded-3xl p-6 sm:p-9"
            style={{ boxShadow: "0 60px 140px -40px rgba(0,0,0,0.95)" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-blue-600/25 blur-[80px]"
            />
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-[9px] uppercase tracking-[0.34em] text-sky-300/60">
                  Request a Demo
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,4vw,2.2rem)] font-extralight leading-tight tracking-tight text-gradient">
                  See the systems running live.
                </h3>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/45">
                  Tell me what you run today and I’ll walk you through the closest build — payroll,
                  hospitality, fleet or accounting migration.
                </p>
              </div>
              <button
                onClick={onClose}
                data-cursor="button"
                aria-label="Close"
                className="glass grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white/70 transition hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative mt-8">
              <DemoForm onSent={() => setTimeout(onClose, 900)} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
