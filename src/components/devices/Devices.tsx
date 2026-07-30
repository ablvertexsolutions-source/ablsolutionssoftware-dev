import type { ReactNode } from "react";

/** Glass surface: container-query root so inner UI scales with the device. */
function Surface({ children, radius = "0.7rem" }: { children: ReactNode; radius?: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#04070f]"
      style={{ borderRadius: radius, containerType: "size", fontSize: "5.2cqh" }}
    >
      {children}
      {/* glass reflection */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 22%, transparent 46%, rgba(255,255,255,0.045) 78%, transparent 100%)",
        }}
      />
      {/* screen glow */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 0 3em rgba(59,130,246,0.16), inset 0 0 0.6em rgba(125,211,252,0.10)",
        }}
      />
      {/* subtle scan */}
      <span
        className="pointer-events-none absolute inset-x-0 h-[14%] opacity-[0.10]"
        style={{
          background: "linear-gradient(180deg, transparent, #bfe3ff, transparent)",
          animation: "scanline 11s linear infinite",
        }}
      />
    </div>
  );
}

const alu =
  "linear-gradient(150deg, #2a3444 0%, #10151f 32%, #070a12 60%, #1b2330 100%)";

export function MacBook({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {/* lid */}
      <div
        className="relative rounded-[1.1%/1.6%] p-[0.9%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
        style={{
          background: alu,
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: "14px",
          padding: "9px",
          boxShadow:
            "0 46px 90px -34px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.16)",
        }}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[7px]">
          <Surface radius="7px">{children}</Surface>
        </div>
        <span className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25" />
      </div>
      {/* base */}
      <div
        className="relative mx-auto h-[10px] w-[104%] -translate-x-[2%] rounded-b-[10px]"
        style={{
          background: "linear-gradient(180deg, #2b3444, #0d1119 70%, #05070c)",
          boxShadow: "0 24px 44px -18px rgba(0,0,0,0.9)",
        }}
      >
        <span className="absolute left-1/2 top-0 h-[3px] w-[16%] -translate-x-1/2 rounded-b-full bg-black/60" />
      </div>
      {/* floor reflection */}
      <div
        className="pointer-events-none absolute inset-x-[6%] top-full h-[42%] opacity-25 blur-[2px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(96,165,250,0.22), transparent 70%)",
          maskImage: "linear-gradient(180deg, #000, transparent)",
        }}
      />
    </div>
  );
}

export function Monitor({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative rounded-[12px] p-[8px]"
        style={{
          background: alu,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 50px 90px -36px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px]">
          <Surface radius="6px">{children}</Surface>
        </div>
      </div>
      <div className="mx-auto mt-[-1px] flex flex-col items-center">
        <div
          className="h-[22px] w-[12%]"
          style={{ background: "linear-gradient(180deg,#232c3a,#0c1017)" }}
        />
        <div
          className="h-[6px] w-[34%] rounded-full"
          style={{
            background: "linear-gradient(180deg,#2b3444,#080b11)",
            boxShadow: "0 18px 30px -14px rgba(0,0,0,0.9)",
          }}
        />
      </div>
    </div>
  );
}

export function Tablet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative rounded-[18px] p-[7px]"
        style={{
          background: alu,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 44px 80px -34px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
          <Surface radius="12px">{children}</Surface>
        </div>
        <span className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25" />
      </div>
    </div>
  );
}

export function IPhone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative rounded-[26px] p-[5px]"
        style={{
          background: "linear-gradient(150deg,#3a4353,#11161f 40%,#080b11 70%,#242c3a)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "0 40px 70px -28px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[22px]">
          <Surface radius="22px">{children}</Surface>
          {/* dynamic island */}
          <span className="absolute left-1/2 top-[2.5%] h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        </div>
        {/* side buttons */}
        <span className="absolute -right-[2px] top-[24%] h-[9%] w-[2px] rounded-r bg-white/20" />
        <span className="absolute -left-[2px] top-[18%] h-[6%] w-[2px] rounded-l bg-white/15" />
        <span className="absolute -left-[2px] top-[27%] h-[6%] w-[2px] rounded-l bg-white/15" />
      </div>
    </div>
  );
}
