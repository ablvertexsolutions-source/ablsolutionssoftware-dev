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
  /** Optional real product screenshot rendered inside the device mockup. */
  screenshot?: string;
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
    tagline: "One Platform That Automates Your Entire Payroll Process",
    description:
      "Every payroll cycle costs valuable time when attendance, leave requests, overtime, government deductions, and payroll calculations are handled manually.\n\nABL Payroll automates the complete workflow — from employee clock-in to final payslip — reducing payroll processing time, minimizing human error, and providing management with real-time visibility into workforce performance and labor costs.",
    year: "2025",
    accent: "#3b82f6",
    accentSoft: "rgba(59,130,246,0.18)",
    stack: [
      "React",
      "TypeScript",
      "Supabase",
      "AI Automation",
      "GPS Tracking",
      "Face ID",
      "QR Attendance",
      "Payroll Engine",
      "Self Service",
      "Cloud + Offline",
    ],
    features: [
      "Reduce payroll processing time by up to 90%",
      "Eliminate manual attendance encoding",
      "Prevent time theft using GPS + Selfie Verification",
      "Generate payroll in just a few clicks",
      "View labor costs in real time",
      "Improve payroll accuracy and compliance",
      "Employee Self-Service Portal",
      "Multi-branch ready",
    ],
    stats: [
      { value: 94, suffix: "%", label: "Less manual entry" },
      { value: 3, suffix: "days", label: "Cycle time saved" },
      { value: 100, suffix: "%", label: "Reconciled accuracy" },
    ],
    video: "/videos/abl-payroll.mp4",
    device: "macbook",
    screenshot: "/images/abl-dashboard.jpg",
  },
  {
    id: "serenity-resort",
    index: "02",
    name: "Serenity Resort",
    category: "Hospitality Operations Suite",
    tagline: "Complete Resort Management Suite",
    description:
      "Run your entire resort from one intelligent platform. Manage reservations, room availability, guest check-ins, restaurant sales, POS transactions, cash flow, expenses, housekeeping, maintenance, and business analytics — all in one centralized dashboard.\n\nSay goodbye to double bookings, manual spreadsheets, and scattered records. With real-time availability, automated reservation management, and live financial monitoring, every department stays connected so you can focus on growing your business.\n\nEverything your resort needs. One powerful system.",
    year: "2025",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,0.18)",
    stack: ["React", "TypeScript", "Supabase Realtime", "Tailwind", "POS Engine"],
    features: [
      "Smart Reservation & Booking Calendar",
      "Advance Booking & Reservation Board",
      "Real-Time Room Availability",
      "Walk-In & Online Guest Management",
      "Front Desk Check-In / Check-Out",
      "Restaurant & POS Integration",
      "Cash Flow Monitoring Dashboard",
      "Daily Sales & Income Reports",
      "Expense & Petty Cash Tracking",
      "Occupancy Rate Analytics",
      "Housekeeping Management",
      "Maintenance & Repair Requests",
      "Guest Profiles & Booking History",
      "Automated Invoice & Official Receipt",
      "Multiple Payment Methods (Cash, GCash, Card, Bank Transfer)",
      "QR Code Booking Confirmation",
      "Owner Executive Dashboard",
      "Staff Activity Monitoring",
      "Financial Reports & Profit Analysis",
    ],
    stats: [
      { value: 38, suffix: "%", label: "Higher occupancy clarity" },
      { value: 0, suffix: "", label: "Double bookings" },
      { value: 12, suffix: "hrs", label: "Saved weekly" },
    ],
    video: "/videos/serenity-resort.mp4",
    device: "macbook",
    screenshot: "/images/serenity-dashboard.jpg",
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
