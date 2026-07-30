/**
 * Miniature, fully animated product UIs rendered inside the hero devices.
 * Everything is em-based and driven by a container-query root font-size,
 * so each screen scales pixel-perfectly inside any device frame.
 */
import type { ReactElement, ReactNode } from "react";

function Bar({ i, a, b, tint }: { i: number; a: number; b: number; tint: string }) {
  return (
    <div className="flex h-full flex-1 items-end">
      <div
        className="w-full origin-bottom rounded-[0.15em]"
        style={{
          height: "100%",
          background: `linear-gradient(180deg, ${tint}, ${tint}22)`,
          ["--a" as string]: a,
          ["--b" as string]: b,
          animation: `bar-rise ${3 + (i % 4) * 0.6}s ease-in-out ${i * 0.16}s infinite`,
        }}
      />
    </div>
  );
}

function Spark({ tint, points }: { tint: string; points: string }) {
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id={`g${tint.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.45" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,34 ${points} 100,34`} fill={`url(#g${tint.replace(/[^a-z0-9]/gi, "")})`} />
      <polyline
        points={points}
        fill="none"
        stroke={tint}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeDasharray="220"
        style={{ animation: "dash-flow 9s linear infinite" }}
      />
    </svg>
  );
}

function Chrome({ title, tint }: { title: string; tint: string }) {
  return (
    <div className="flex items-center gap-[0.5em] border-b border-white/[0.07] px-[1em] py-[0.7em]">
      <span className="h-[0.42em] w-[0.42em] rounded-full bg-[#ff5f57]/70" />
      <span className="h-[0.42em] w-[0.42em] rounded-full bg-[#febc2e]/70" />
      <span className="h-[0.42em] w-[0.42em] rounded-full bg-[#28c840]/70" />
      <div className="ml-[0.8em] flex items-center gap-[0.4em] rounded-full bg-white/[0.05] px-[0.8em] py-[0.22em]">
        <span className="h-[0.3em] w-[0.3em] rounded-full" style={{ background: tint }} />
        <span className="text-[0.5em] tracking-[0.14em] text-white/45">{title}</span>
      </div>
    </div>
  );
}

const Panel = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[0.5em] border border-white/[0.07] bg-white/[0.03] p-[0.7em] ${className}`}
  >
    {children}
  </div>
);

/* ── 01 · ABL Payroll ───────────────────────────────── */
export function PayrollScreen() {
  const tint = "#60a5fa";
  const rows = [
    ["Maria S.", "Operations", "8,420.00", 96],
    ["James O.", "Logistics", "6,180.50", 78],
    ["Anna K.", "Finance", "7,940.00", 88],
    ["Paulo R.", "Warehouse", "5,260.75", 64],
    ["Nina T.", "Support", "4,880.20", 52],
  ] as const;

  return (
    <div className="flex h-full w-full flex-col bg-[#060b16] text-white">
      <Chrome title="ABL PAYROLL · CYCLE 24" tint={tint} />
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[3.4em] flex-col items-center gap-[0.75em] border-r border-white/[0.06] py-[1em]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-[0.9em] w-[0.9em] rounded-[0.25em]"
              style={{
                background: i === 1 ? tint : "rgba(255,255,255,0.09)",
                boxShadow: i === 1 ? `0 0 1.2em ${tint}` : "none",
              }}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[0.7em] p-[1em]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[0.5em] uppercase tracking-[0.22em] text-white/35">
                Net payroll · November
              </p>
              <p className="mt-[0.25em] text-[1.5em] font-semibold tracking-tight">
                $248,610<span className="text-white/30">.42</span>
              </p>
            </div>
            <div className="flex gap-[0.5em]">
              <span
                className="rounded-full px-[0.7em] py-[0.28em] text-[0.46em] uppercase tracking-[0.16em]"
                style={{ background: `${tint}22`, color: tint }}
              >
                Reconciled
              </span>
              <span className="rounded-full bg-white/[0.06] px-[0.7em] py-[0.28em] text-[0.46em] uppercase tracking-[0.16em] text-white/50">
                Export
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[0.6em]">
            {[
              ["Employees", "184"],
              ["Deductions", "$41.2K"],
              ["Runtime", "38s"],
            ].map(([k, v]) => (
              <Panel key={k}>
                <p className="text-[0.44em] uppercase tracking-[0.2em] text-white/35">{k}</p>
                <p className="mt-[0.3em] text-[0.85em] font-medium">{v}</p>
              </Panel>
            ))}
          </div>

          <Panel className="min-h-0 flex-1">
            <div className="flex h-full flex-col justify-between gap-[0.35em]">
              {rows.map(([n, d, amt, pct], i) => (
                <div key={n} className="flex items-center gap-[0.6em]">
                  <span
                    className="h-[0.9em] w-[0.9em] shrink-0 rounded-full text-center text-[0.4em] leading-[2.2em]"
                    style={{ background: `${tint}25`, color: tint }}
                  >
                    {n[0]}
                  </span>
                  <span className="w-[4.5em] shrink-0 truncate text-[0.5em] text-white/75">{n}</span>
                  <span className="hidden w-[4em] shrink-0 truncate text-[0.46em] text-white/30 sm:block">
                    {d}
                  </span>
                  <span className="h-[0.28em] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${tint}, #22d3ee)`,
                        animation: `soft-pulse ${4 + i * 0.4}s ease-in-out infinite`,
                      }}
                    />
                  </span>
                  <span className="w-[3.2em] shrink-0 text-right text-[0.48em] tabular-nums text-white/70">
                    {amt}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ── 02 · Serenity Resort ───────────────────────────── */
export function ResortScreen() {
  const tint = "#22d3ee";
  return (
    <div className="flex h-full w-full flex-col bg-[#050b14] text-white">
      <Chrome title="SERENITY · FRONT DESK" tint={tint} />
      <div className="flex min-h-0 flex-1 flex-col gap-[0.7em] p-[1em]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.5em] uppercase tracking-[0.22em] text-white/35">
              Occupancy · this week
            </p>
            <p className="mt-[0.2em] text-[1.35em] font-semibold tracking-tight">
              92<span className="text-white/30">%</span>
              <span className="ml-[0.5em] text-[0.4em] uppercase tracking-[0.2em] text-emerald-300/80">
                ▲ 12%
              </span>
            </p>
          </div>
          <div className="flex gap-[0.35em]">
            {["Rooms", "Guests", "Folios"].map((t, i) => (
              <span
                key={t}
                className="rounded-full px-[0.7em] py-[0.3em] text-[0.45em] uppercase tracking-[0.16em]"
                style={{
                  background: i === 0 ? `${tint}22` : "rgba(255,255,255,0.05)",
                  color: i === 0 ? tint : "rgba(255,255,255,0.45)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Panel className="min-h-0 flex-1">
          <div className="mb-[0.5em] flex justify-between text-[0.42em] uppercase tracking-[0.2em] text-white/25">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[0.28em]">
            {Array.from({ length: 35 }).map((_, i) => {
              const state = (i * 7) % 11;
              const booked = state < 6;
              const arriving = state === 6 || state === 7;
              return (
                <span
                  key={i}
                  className="h-[0.95em] rounded-[0.2em]"
                  style={{
                    background: booked
                      ? `linear-gradient(120deg, ${tint}cc, #3b82f6aa)`
                      : arriving
                        ? "rgba(96,165,250,0.28)"
                        : "rgba(255,255,255,0.045)",
                    boxShadow: booked ? `0 0 0.7em ${tint}33` : "none",
                    animation: booked
                      ? `soft-pulse ${5 + (i % 5)}s ease-in-out ${i * 0.05}s infinite`
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        </Panel>

        <div className="grid grid-cols-3 gap-[0.6em]">
          <Panel className="col-span-2">
            <p className="text-[0.44em] uppercase tracking-[0.2em] text-white/35">
              Revenue · RevPAR
            </p>
            <div className="mt-[0.35em] h-[2.6em]">
              <Spark tint={tint} points="0,26 14,20 28,23 42,12 56,16 70,7 84,10 100,3" />
            </div>
          </Panel>
          <Panel>
            <p className="text-[0.44em] uppercase tracking-[0.2em] text-white/35">Arrivals</p>
            <p className="mt-[0.3em] text-[1.1em] font-semibold">14</p>
            <p className="text-[0.42em] text-white/30">3 VIP · 2 late</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · Fuel Saver (mobile) ───────────────────────── */
export function FuelScreen() {
  const tint = "#60a5fa";
  return (
    <div className="relative flex h-full w-full flex-col bg-[#050a14] px-[1em] pb-[1em] pt-[2em] text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.45em] uppercase tracking-[0.22em] text-white/35">Fleet average</p>
          <p className="text-[1.2em] font-semibold tracking-tight">
            7.4<span className="ml-[0.2em] text-[0.42em] text-white/40">L / 100km</span>
          </p>
        </div>
        <span
          className="grid h-[1.7em] w-[1.7em] place-items-center rounded-full text-[0.5em]"
          style={{ background: `${tint}22`, color: tint }}
        >
          ⛽
        </span>
      </div>

      <div className="mt-[0.8em] rounded-[0.6em] border border-white/[0.07] bg-white/[0.03] p-[0.7em]">
        <div className="flex items-end justify-between">
          <p className="text-[0.42em] uppercase tracking-[0.2em] text-white/35">Monthly spend</p>
          <p className="text-[0.5em] text-emerald-300/85">-17%</p>
        </div>
        <div className="mt-[0.5em] flex h-[3.2em] items-end gap-[0.22em]">
          {[0.6, 0.8, 0.55, 0.95, 0.7, 0.45, 0.85, 0.5, 0.75, 0.4].map((h, i) => (
            <Bar key={i} i={i} a={h * 0.7} b={h} tint={tint} />
          ))}
        </div>
      </div>

      <div className="mt-[0.7em] flex-1 space-y-[0.45em]">
        {[
          ["Truck 04", "Route N-12", "$182.40", "#22d3ee"],
          ["Van 11", "City loop", "$96.10", "#60a5fa"],
          ["Truck 07", "Route S-3", "$204.85", "#818cf8"],
        ].map(([a, b, c, col], i) => (
          <div
            key={a}
            className="flex items-center gap-[0.55em] rounded-[0.5em] border border-white/[0.06] bg-white/[0.03] px-[0.6em] py-[0.45em]"
            style={{ animation: `soft-pulse ${6 + i}s ease-in-out ${i * 0.5}s infinite` }}
          >
            <span
              className="h-[1.1em] w-[1.1em] rounded-[0.3em]"
              style={{ background: `${col}30`, border: `1px solid ${col}55` }}
            />
            <span className="flex-1">
              <span className="block text-[0.5em] text-white/80">{a}</span>
              <span className="block text-[0.42em] text-white/30">{b}</span>
            </span>
            <span className="text-[0.5em] tabular-nums text-white/70">{c}</span>
          </div>
        ))}
      </div>

      <div
        className="rounded-full py-[0.5em] text-center text-[0.46em] uppercase tracking-[0.22em]"
        style={{
          background: "linear-gradient(120deg, rgba(37,99,235,0.9), rgba(34,211,238,0.75))",
          boxShadow: "0 0.4em 1.4em -0.5em rgba(37,99,235,0.9)",
        }}
      >
        Scan receipt
      </div>

      {/* AI scan sweep */}
      <span
        className="pointer-events-none absolute inset-x-[1em] top-[3em] h-[1.2em] rounded-full"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(96,165,250,0.35), transparent)",
          animation: "scanline 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ── 04 · QuickBooks Converter ──────────────────────── */
export function ConverterScreen() {
  const tint = "#818cf8";
  const files = [
    ["statement_oct.pdf", "Mapped", 100],
    ["payables_q3.csv", "Mapped", 100],
    ["bank_feed_nov.pdf", "Classifying", 68],
    ["receipts_batch.csv", "Queued", 24],
  ] as const;

  return (
    <div className="flex h-full w-full flex-col bg-[#070915] text-white">
      <Chrome title="QB CONVERTER · BATCH 12" tint={tint} />
      <div className="flex min-h-0 flex-1 gap-[0.7em] p-[1em]">
        <div className="flex min-w-0 flex-[1.35] flex-col gap-[0.5em]">
          <p className="text-[0.45em] uppercase tracking-[0.22em] text-white/35">
            Ingestion pipeline
          </p>
          {files.map(([f, s, p], i) => (
            <div
              key={f}
              className="rounded-[0.5em] border border-white/[0.07] bg-white/[0.03] px-[0.65em] py-[0.5em]"
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-[0.48em] text-white/75">{f}</span>
                <span
                  className="text-[0.42em] uppercase tracking-[0.16em]"
                  style={{ color: p === 100 ? "#4ade80" : tint }}
                >
                  {s}
                </span>
              </div>
              <span className="mt-[0.4em] block h-[0.22em] overflow-hidden rounded-full bg-white/[0.07]">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${p}%`,
                    background:
                      p === 100
                        ? "linear-gradient(90deg,#22d3ee,#4ade80)"
                        : `linear-gradient(90deg, ${tint}, #22d3ee)`,
                    animation: p < 100 ? `soft-pulse ${3 + i}s ease-in-out infinite` : undefined,
                  }}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[0.5em]">
          <Panel className="flex-1">
            <p className="text-[0.44em] uppercase tracking-[0.2em] text-white/35">
              Account mapping
            </p>
            <div className="mt-[0.5em] space-y-[0.42em]">
              {[
                ["6110", "Fuel & Travel"],
                ["5020", "COGS · Supplies"],
                ["2100", "Accounts Payable"],
                ["4000", "Sales Revenue"],
              ].map(([code, name], i) => (
                <div key={code} className="flex items-center gap-[0.45em]">
                  <span
                    className="rounded-[0.25em] px-[0.35em] py-[0.12em] text-[0.4em] tabular-nums"
                    style={{ background: `${tint}22`, color: tint }}
                  >
                    {code}
                  </span>
                  <span className="flex-1 truncate text-[0.44em] text-white/55">{name}</span>
                  <span
                    className="h-[0.3em] w-[0.3em] rounded-full bg-emerald-400"
                    style={{ animation: `soft-pulse ${3 + i * 0.6}s ease-in-out infinite` }}
                  />
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="text-[0.44em] uppercase tracking-[0.2em] text-white/35">Ready to import</p>
            <p className="mt-[0.25em] text-[0.95em] font-semibold">2,514 txns</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export const SCREENS: Record<string, () => ReactElement> = {
  "abl-payroll": PayrollScreen,
  "serenity-resort": ResortScreen,
  "fuel-saver": FuelScreen,
  "quickbooks-converter": ConverterScreen,
};
