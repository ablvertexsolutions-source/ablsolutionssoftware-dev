import serenityVideo from "../assets/serenity-resort.mp4.asset.json";

export type Project = {
  id: string;
  index: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  year: string;
  accent: string;
  accentSoft: string;
  stack: string[];
  features: string[];
  stats: { value: number; suffix: string; label: string }[];
  video: string;
  device: "macbook" | "monitor" | "tablet" | "iphone";
};

export const PROFILE = {
  name: "Adrian Llano",
  initials: "AL",
  email: "adrian.llano79@gmail.com",
  role: "AI Business Systems Engineer",
  location: "Available Worldwide · Remote",
  headline: ["Business", "Operator", "turned", "Systems", "Architect"],
  intro:
    "I spent twenty years inside the books — payroll, inventory, reconciliation, financial operations. Now I build the software that removes the friction I lived through.",
};

export const NAV = [
  { id: "hero", label: "Home" },
  { id: "about", label: "Story" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export const PROJECTS: Project[] = [
  {
    id: "abl-payroll",
    index: "01",
    name: "ABL Payroll",
    category: "Workforce & Compliance Platform",
    tagline: "Payroll that closes itself.",
    description:
      "A full payroll engine built for growing companies: timesheet capture, statutory deductions, payslip generation and journal exports that reconcile to the cent — the whole cycle collapsed from three days into a single afternoon.",
    year: "2025",
    accent: "#3b82f6",
    accentSoft: "rgba(59,130,246,0.18)",
    stack: ["React", "TypeScript", "Supabase", "Postgres RLS", "Edge Functions"],
    features: [
      "Automated statutory & benefit computations",
      "Timesheet → payslip pipeline with audit trail",
      "Role-based access with row-level security",
      "One-click journal export to QuickBooks / Xero",
    ],
    stats: [
      { value: 94, suffix: "%", label: "Less manual entry" },
      { value: 3, suffix: "days", label: "Cycle time saved" },
      { value: 100, suffix: "%", label: "Reconciled accuracy" },
    ],
    video: "/videos/abl-payroll.mp4",
    device: "macbook",
  },
  {
    id: "serenity-resort",
    index: "02",
    name: "Serenity Resort",
    category: "Hospitality Operations Suite",
    tagline: "One calendar. Every room. Zero double bookings.",
    description:
      "A property management system for boutique resorts — live availability grid, guest CRM, folio billing and housekeeping flow, all synchronised in real time across the front desk, mobile and the owner's dashboard.",
    year: "2025",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,0.18)",
    stack: ["React", "TypeScript", "Supabase Realtime", "Tailwind", "Stripe"],
    features: [
      "Realtime availability & rate calendar",
      "Guest profiles, folios and split billing",
      "Housekeeping and maintenance boards",
      "Owner analytics: RevPAR, ADR, occupancy",
    ],
    stats: [
      { value: 38, suffix: "%", label: "Higher occupancy clarity" },
      { value: 0, suffix: "", label: "Double bookings" },
      { value: 12, suffix: "hrs", label: "Saved weekly" },
    ],
    video: serenityVideo.url,
    device: "monitor",
  },
  {
    id: "fuel-saver",
    index: "03",
    name: "Fuel Saver",
    category: "Fleet Intelligence",
    tagline: "Every litre, accounted for.",
    description:
      "A fleet fuel intelligence app that turns pump receipts into insight — consumption per vehicle, per driver, per route, with anomaly detection that flags the leaks most operators never see.",
    year: "2024",
    accent: "#60a5fa",
    accentSoft: "rgba(96,165,250,0.18)",
    stack: ["React", "Python", "OpenAI Vision", "Supabase", "Recharts"],
    features: [
      "Receipt OCR with AI line-item extraction",
      "Cost-per-kilometre and efficiency trends",
      "Anomaly alerts for irregular consumption",
      "Driver and vehicle league tables",
    ],
    stats: [
      { value: 17, suffix: "%", label: "Average fuel reduction" },
      { value: 6, suffix: "sec", label: "Receipt to record" },
      { value: 40, suffix: "+", label: "Vehicles tracked" },
    ],
    video: "/videos/fuel-saver.mp4",
    device: "iphone",
  },
  {
    id: "quickbooks-converter",
    index: "04",
    name: "QuickBooks Converter",
    category: "Accounting Data Engineering",
    tagline: "Any statement in. Clean ledger out.",
    description:
      "A conversion engine that ingests messy bank statements, CSVs and PDFs and outputs perfectly mapped, import-ready QuickBooks and Xero files — twenty years of bookkeeping judgement encoded into rules and AI classification.",
    year: "2024",
    accent: "#818cf8",
    accentSoft: "rgba(129,140,248,0.18)",
    stack: ["Python", "Pandas", "React", "Claude Code", "QBO / Xero API"],
    features: [
      "PDF & CSV parsing with layout detection",
      "AI chart-of-accounts classification",
      "Duplicate and rounding-error catching",
      "IIF / QBO / CSV export presets",
    ],
    stats: [
      { value: 2500, suffix: "+", label: "Transactions per run" },
      { value: 99, suffix: "%", label: "Mapping accuracy" },
      { value: 90, suffix: "%", label: "Faster migration" },
    ],
    video: "/videos/quickbooks-converter.mp4",
    device: "tablet",
  },
];

export const SKILLS = [
  { name: "React", tint: "#61dafb", glyph: "⚛" },
  { name: "TypeScript", tint: "#3178c6", glyph: "TS" },
  { name: "Python", tint: "#ffd43b", glyph: "PY" },
  { name: "Supabase", tint: "#3ecf8e", glyph: "⚡" },
  { name: "Claude Code", tint: "#d97757", glyph: "✳" },
  { name: "Cursor", tint: "#e2e8f0", glyph: "▶" },
  { name: "OpenAI", tint: "#74aa9c", glyph: "◎" },
  { name: "Lovable", tint: "#f472b6", glyph: "♥" },
  { name: "QuickBooks", tint: "#2ca01c", glyph: "QB" },
  { name: "Xero", tint: "#13b5ea", glyph: "X" },
  { name: "CapCut", tint: "#a78bfa", glyph: "✂" },
  { name: "Google Flow", tint: "#ea4335", glyph: "≈" },
  { name: "Seedance", tint: "#38bdf8", glyph: "◆" },
  { name: "Higgsfield AI", tint: "#fb923c", glyph: "✦" },
];

export const CHAPTER_ONE = [
  "Accounting",
  "Bookkeeping",
  "Inventory",
  "Financial Operations",
  "Business Improvement",
];

export const CHAPTER_TWO = [
  "React",
  "TypeScript",
  "Python",
  "Supabase",
  "Claude Code",
  "OpenAI",
];

export const MARQUEE = [
  "Payroll Systems",
  "AI Automation",
  "Financial Operations",
  "Realtime Dashboards",
  "Data Migration",
  "Inventory Control",
  "Fleet Intelligence",
  "Business Improvement",
];
