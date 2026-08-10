import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  STATUSES,
  adminAnalytics,
  adminChangePassword,
  adminLogin,
  adminLogout,
  adminStatus,
  backupData,
  deleteRequest,
  listRequests,
  restoreData,
  saveSplashImage,
  updateRequest,
  type DemoRequest,
} from "../../lib/admin.functions";
import { GhostBtn, Label, PrimaryBtn, StatusPill, card, fmtDate, fmtTime, input } from "./ui";

type Section = "dashboard" | "logs" | "analytics" | "maintenance";

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    adminStatus()
      .then((r) => setAuthed(r.authed))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) return <div className="min-h-screen bg-[#04070f]" />;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Shell onLogout={() => setAuthed(false)} />;
}

/* ─────────────────────────── LOGIN ─────────────────────────── */

function Login({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await adminLogin({ data: { username, password } });
      if (r.ok) onDone();
      else setError(r.error ?? "Invalid username or password.");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? `Admin authentication service is unavailable (${err.message}).`
          : "Admin authentication service is unavailable.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#04070f] px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 50% 0%, rgba(37,99,235,0.2), transparent 65%)",
        }}
      />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-md p-8 ${card}`}
      >
        <p className="font-display text-[9px] uppercase tracking-[0.34em] text-sky-300/60">
          Restricted Access
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.4rem,4vw,2rem)] font-extralight tracking-tight text-gradient">
          ABL VERTEX ADMIN
        </h1>
        <div className="mt-8">
          <Label>Username</Label>
          <input
            autoFocus
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={input}
            placeholder="admin"
          />
        </div>
        <div className="mt-5">
          <Label>Password</Label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
            placeholder="••••"
          />
        </div>
        {error && <p className="mt-3 text-[12px] text-rose-300/80">{error}</p>}
        <div className="mt-7 flex justify-end">
          <PrimaryBtn type="submit" disabled={busy}>
            {busy ? "Verifying…" : "Enter"}
          </PrimaryBtn>
        </div>
      </motion.form>
    </div>
  );
}

/* ─────────────────────────── SHELL ─────────────────────────── */

function Shell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("dashboard");
  const [rows, setRows] = useState<DemoRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [active, setActive] = useState<DemoRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const known = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  const load = useCallback(async () => {
    try {
      const r = await listRequests({ data: { search, status } });
      setRows(r.rows);
      if (primed.current) {
        const fresh = r.rows.filter((x) => !known.current.has(x.id));
        if (fresh.length) setToast(`${fresh.length} new demo request${fresh.length > 1 ? "s" : ""}`);
      }
      known.current = new Set(r.rows.map((x) => x.id));
      primed.current = true;
    } catch {
      /* session may have expired */
    }
  }, [search, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const logout = async () => {
    await adminLogout().catch(() => undefined);
    onLogout();
  };

  const openRequest = async (r: DemoRequest) => {
    setActive(r);
    if (r.status === "NEW") {
      await updateRequest({ data: { id: r.id, status: "READ" } }).catch(() => undefined);
      setActive({ ...r, status: "READ" });
      load();
    }
  };

  const nav: { id: Section; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "logs", label: "Customer Logs" },
    { id: "analytics", label: "Analytics" },
    { id: "maintenance", label: "Maintenance" },
  ];

  return (
    <div className="relative min-h-screen bg-[#04070f] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 15% 0%, rgba(37,99,235,0.16), transparent 60%), radial-gradient(60% 50% at 100% 100%, rgba(34,211,238,0.08), transparent 65%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1500px] flex-col gap-6 p-4 lg:flex-row lg:p-8">
        <aside className={`h-max shrink-0 p-5 lg:w-64 ${card}`}>
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-sky-300/70">
            ABL VERTEX
          </p>
          <p className="mt-1 font-display text-[10px] uppercase tracking-[0.3em] text-white/40">
            Admin
          </p>
          <nav className="mt-7 flex flex-wrap gap-2 lg:flex-col">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`rounded-xl px-4 py-3 text-left font-display text-[10px] uppercase tracking-[0.22em] transition-all duration-300 ${
                  section === n.id
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-400/10 text-white"
                    : "text-white/45 hover:text-white"
                }`}
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="rounded-xl px-4 py-3 text-left font-display text-[10px] uppercase tracking-[0.22em] text-rose-300/70 transition hover:text-rose-200"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {section === "dashboard" && (
            <Dashboard rows={rows} onOpen={openRequest} onSeeAll={() => setSection("logs")} />
          )}
          {section === "logs" && (
            <Logs
              rows={rows}
              search={search}
              status={status}
              onSearch={setSearch}
              onStatus={setStatus}
              onOpen={openRequest}
              onNotify={setToast}
              onRefresh={load}
            />
          )}
          {section === "analytics" && <Analytics />}
          {section === "maintenance" && <Maintenance onLogout={logout} />}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-6 right-6 z-[150] px-5 py-3 text-[12px] text-white/80 ${card}`}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <Detail
        row={active}
        onClose={() => setActive(null)}
        onChanged={() => {
          load();
        }}
        onDeleted={() => {
          setActive(null);
          load();
        }}
      />
    </div>
  );
}

/* ────────────────────────── DASHBOARD ────────────────────────── */

function Dashboard({
  rows,
  onOpen,
  onSeeAll,
}: {
  rows: DemoRequest[];
  onOpen: (r: DemoRequest) => void;
  onSeeAll: () => void;
}) {
  const count = (s: string) => rows.filter((r) => r.status.toUpperCase() === s.toUpperCase()).length;
  const cards = [
    { label: "Total Requests", value: rows.length },
    { label: "New Requests", value: count("NEW") },
    { label: "Read", value: count("READ") },
    { label: "Replied", value: count("REPLIED") },
    { label: "Archived", value: count("ARCHIVED") },
  ];

  return (
    <div className="space-y-6">
      <Header title="Dashboard" subtitle="Live overview of incoming demo requests." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={`p-5 ${card}`}>
            <p className="font-display text-[9px] uppercase tracking-[0.26em] text-white/40">
              {c.label}
            </p>
            <p className="mt-3 font-display text-4xl font-extralight text-gradient">{c.value}</p>
          </div>
        ))}
      </div>
      <div className={`p-5 ${card}`}>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-[10px] uppercase tracking-[0.26em] text-white/50">
            Latest Requests
          </p>
          <GhostBtn onClick={onSeeAll}>View all</GhostBtn>
        </div>
        <div className="space-y-2">
          {rows.slice(0, 6).map((r) => (
            <button
              key={r.id}
              onClick={() => onOpen(r)}
              className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition hover:border-sky-300/30"
            >
              <span className="text-[13px] text-white/85">
                {r.full_name}
                <span className="text-white/35"> · {r.company || "—"}</span>
              </span>
              <span className="flex items-center gap-3 text-[11px] text-white/40">
                {fmtDate(r.created_at)} · {fmtTime(r.created_at)}
                <StatusPill status={r.status} />
              </span>
            </button>
          ))}
          {!rows.length && <p className="py-6 text-center text-[13px] text-white/35">No requests yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-extralight tracking-tight text-gradient">
        {title}
      </h1>
      <p className="mt-2 text-[13px] text-white/40">{subtitle}</p>
    </div>
  );
}

/* ──────────────────────── CUSTOMER LOGS ──────────────────────── */

function Logs({
  rows,
  search,
  status,
  onSearch,
  onStatus,
  onOpen,
}: {
  rows: DemoRequest[];
  search: string;
  status: string;
  onSearch: (v: string) => void;
  onStatus: (v: string) => void;
  onOpen: (r: DemoRequest) => void;
  onNotify: (m: string) => void;
  onRefresh: () => void;
}) {
  const filters = ["All", ...STATUSES];
  const [pending, setPending] = useState<DemoRequest | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await deleteRequest({ data: { id: pending.id } });
      setPending(null);
      onNotify("Customer request deleted successfully.");
      onRefresh();
    } catch {
      setPending(null);
      onNotify("Unable to delete this customer request. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-6">
      <Header title="Customer Logs" subtitle="Every demo request submitted from the website." />
      <div className={`p-5 ${card}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search name, company, email, phone, country, subject…"
            className={`${input} lg:max-w-md`}
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => onStatus(f)}
                className={`rounded-full border px-4 py-2 font-display text-[9px] uppercase tracking-[0.2em] transition ${
                  status === f
                    ? "border-sky-300/50 text-white"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="font-display text-[9px] uppercase tracking-[0.2em] text-white/35">
                {["Request ID", "Date", "Time", "Full Name", "Company", "Email", "Phone", "Country", "Subject", "System", "Status"].map(
                  (h) => (
                    <th key={h} className="border-b border-white/8 px-3 py-3 font-normal">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onOpen(r)}
                  className="cursor-pointer text-white/70 transition hover:bg-white/[0.04]"
                >
                  <td className="border-b border-white/5 px-3 py-3 font-mono text-[11px] text-white/40">
                    {r.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="border-b border-white/5 px-3 py-3">{fmtDate(r.created_at)}</td>
                  <td className="border-b border-white/5 px-3 py-3">{fmtTime(r.created_at)}</td>
                  <td className="border-b border-white/5 px-3 py-3 text-white/90">{r.full_name}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.company || "—"}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.work_email}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.phone || "—"}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.country || "—"}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.subject || "—"}</td>
                  <td className="border-b border-white/5 px-3 py-3">{r.system_interest || "—"}</td>
                  <td className="border-b border-white/5 px-3 py-3">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="py-10 text-center text-[13px] text-white/35">No matching requests.</p>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── REQUEST DETAILS ─────────────────────── */

function Detail({
  row,
  onClose,
  onChanged,
  onDeleted,
}: {
  row: DemoRequest | null;
  onClose: () => void;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("NEW");
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!row) return;
    setNotes(row.notes ?? "");
    setStatus(row.status);
    setConfirm(false);
    setSaved(false);
  }, [row]);

  if (!row) return null;

  const save = async () => {
    await updateRequest({ data: { id: row.id, status, notes } });
    setSaved(true);
    onChanged();
    setTimeout(() => setSaved(false), 2500);
  };

  const remove = async () => {
    await deleteRequest({ data: { id: row.id } });
    onDeleted();
  };

  const fields: [string, string][] = [
    ["Full Name", row.full_name],
    ["Work Email", row.work_email],
    ["Company", row.company || "—"],
    ["Phone", row.phone || "—"],
    ["Country", row.country || "—"],
    ["Subject", row.subject || "—"],
    ["System of Interest", row.system_interest || "—"],
    ["Date Received", fmtDate(row.created_at)],
    ["Time Received", fmtTime(row.created_at)],
    ["Request ID", row.id],
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[160] flex items-start justify-center overflow-y-auto p-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="fixed inset-0 bg-[#04070f]/85 backdrop-blur-xl" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-3xl p-6 sm:p-8 ${card}`}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-display text-[9px] uppercase tracking-[0.3em] text-sky-300/60">
                Demo Request
              </p>
              <h3 className="mt-2 font-display text-2xl font-extralight tracking-tight text-gradient">
                {row.full_name}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(([k, v]) => (
              <div key={k}>
                <Label>{k}</Label>
                <p className="break-words text-[13px] text-white/80">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Label>Message</Label>
            <p className="whitespace-pre-wrap rounded-xl border border-white/8 bg-white/[0.03] p-4 text-[13px] leading-relaxed text-white/75">
              {row.message || "—"}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Status</Label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b1222]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Quick actions</Label>
              <div className="flex flex-wrap gap-2">
                <GhostBtn onClick={() => setStatus("ARCHIVED")}>Archive</GhostBtn>
                <GhostBtn onClick={() => setStatus("NEW")}>Restore</GhostBtn>
                <GhostBtn tone="danger" onClick={() => setConfirm(true)}>
                  Delete
                </GhostBtn>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Label>Admin notes (private)</Label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes — never visible to the customer."
              className={`${input} resize-none`}
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-[12px] text-emerald-300/80">{saved ? "Saved." : ""}</p>
            <PrimaryBtn onClick={save}>Save changes</PrimaryBtn>
          </div>

          {confirm && (
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-[#04070f]/90 p-6 backdrop-blur-xl">
              <div className="max-w-sm text-center">
                <p className="font-display text-lg font-light text-white">Delete this request?</p>
                <p className="mt-2 text-[13px] text-white/45">
                  This permanently removes the customer record. This cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <GhostBtn onClick={() => setConfirm(false)}>Cancel</GhostBtn>
                  <GhostBtn tone="danger" onClick={remove}>
                    Delete permanently
                  </GhostBtn>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────── ANALYTICS ─────────────────────────── */

type Slim = Pick<DemoRequest, "created_at" | "status" | "country" | "system_interest">;

function Analytics() {
  const [rows, setRows] = useState<Slim[]>([]);
  useEffect(() => {
    adminAnalytics()
      .then((r) => setRows(r.rows))
      .catch(() => undefined);
  }, []);

  const now = Date.now();
  const since = (days: number) => rows.filter((r) => now - new Date(r.created_at).getTime() < days * 864e5).length;

  const group = useMemo(() => {
    const by = (key: keyof Slim) => {
      const m = new Map<string, number>();
      rows.forEach((r) => {
        const k = (r[key] as string) || "Unspecified";
        m.set(k, (m.get(k) ?? 0) + 1);
      });
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    };
    return {
      system: by("system_interest"),
      country: by("country"),
      status: by("status"),
    };
  }, [rows]);

  const cards = [
    { label: "Today", value: since(1) },
    { label: "This Week", value: since(7) },
    { label: "This Month", value: since(30) },
    { label: "Total Requests", value: rows.length },
  ];

  return (
    <div className="space-y-6">
      <Header title="Analytics" subtitle="Demand signals across systems, countries and status." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`p-5 ${card}`}>
            <p className="font-display text-[9px] uppercase tracking-[0.26em] text-white/40">{c.label}</p>
            <p className="mt-3 font-display text-4xl font-extralight text-gradient">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Bars title="By System of Interest" data={group.system} />
        <Bars title="By Country" data={group.country} />
        <Bars title="By Status" data={group.status} />
      </div>
    </div>
  );
}

function Bars({ title, data }: { title: string; data: [string, number][] }) {
  const max = Math.max(1, ...data.map((d) => d[1]));
  return (
    <div className={`p-5 ${card}`}>
      <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/50">{title}</p>
      <div className="mt-5 space-y-3">
        {data.map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-[12px] text-white/60">
              <span className="truncate pr-3">{k}</span>
              <span className="text-white/40">{v}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v / max) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              />
            </div>
          </div>
        ))}
        {!data.length && <p className="py-6 text-center text-[12px] text-white/30">No data yet.</p>}
      </div>
    </div>
  );
}

/* ────────────────────────── MAINTENANCE ────────────────────────── */

function Maintenance({ onLogout }: { onLogout: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [restoreWarn, setRestoreWarn] = useState<string | null>(null);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirmPw) return setMsg("New passwords do not match.");
    if (next.length < 4) return setMsg("New password must be at least 4 characters.");
    const r = await adminChangePassword({ data: { current, next } });
    setMsg(r.ok ? "Password changed successfully." : r.error ?? "Could not change password.");
    if (r.ok) {
      setCurrent("");
      setNext("");
      setConfirmPw("");
    }
  };

  const download = (name: string, content: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stamp = new Date().toISOString().slice(0, 10);

  const backupJson = async () => {
    const data = await backupData();
    download(`abl-vertex-backup-${stamp}.json`, JSON.stringify(data, null, 2), "application/json");
    setMsg("JSON backup downloaded.");
  };

  const backupCsv = async () => {
    const data = await backupData();
    const cols = [
      "id",
      "created_at",
      "full_name",
      "work_email",
      "company",
      "phone",
      "country",
      "subject",
      "system_interest",
      "message",
      "status",
      "notes",
    ] as const;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      cols.join(","),
      ...data.demo_requests.map((r) => cols.map((c) => esc(r[c])).join(",")),
    ].join("\n");
    download(`abl-vertex-backup-${stamp}.csv`, csv, "text/csv");
    setMsg("CSV backup downloaded.");
  };

  const pickRestore = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setRestoreWarn(String(reader.result));
    reader.readAsText(file);
  };

  const doRestore = async () => {
    if (!restoreWarn) return;
    const r = await restoreData({ data: { payload: restoreWarn } });
    setRestoreWarn(null);
    setMsg(r.ok ? `Restored ${r.count} records.` : r.error ?? "Restore failed.");
  };

  const pickSplash = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1920 / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        setPreview(c.toDataURL("image/webp", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveSplash = async () => {
    const r = await saveSplashImage({ data: { dataUrl: preview } });
    setMsg(r.ok ? "Splash screen updated." : r.error ?? "Could not save image.");
  };

  const resetSplash = async () => {
    await saveSplashImage({ data: { dataUrl: null } });
    setPreview(null);
    setMsg("Splash screen reset to default.");
  };

  return (
    <div className="space-y-6">
      <Header title="Maintenance" subtitle="Security, backups and system configuration." />
      {msg && <div className={`px-5 py-3 text-[13px] text-cyan-200/90 ${card}`}>{msg}</div>}

      <form onSubmit={changePassword} className={`p-6 ${card}`}>
        <p className="font-display text-[10px] uppercase tracking-[0.26em] text-white/50">Change Password</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Current password</Label>
            <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
          </div>
          <div>
            <Label>New password</Label>
            <input type="password" required value={next} onChange={(e) => setNext(e.target.value)} className={input} />
          </div>
          <div>
            <Label>Confirm new password</Label>
            <input type="password" required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={input} />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <PrimaryBtn type="submit">Update password</PrimaryBtn>
        </div>
      </form>

      <div className={`p-6 ${card}`}>
        <p className="font-display text-[10px] uppercase tracking-[0.26em] text-white/50">Backup & Restore</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <GhostBtn onClick={backupJson}>Backup JSON</GhostBtn>
          <GhostBtn onClick={backupCsv}>Export CSV</GhostBtn>
          <label className="cursor-pointer rounded-full border border-white/12 px-5 py-2.5 font-display text-[10px] uppercase tracking-[0.24em] text-white/65 transition hover:border-sky-300/40 hover:text-white">
            Restore backup
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && pickRestore(e.target.files[0])}
            />
          </label>
        </div>
        {restoreWarn && (
          <div className="mt-5 rounded-xl border border-amber-300/25 bg-amber-400/5 p-4">
            <p className="text-[13px] text-amber-100/80">
              Restoring this backup may replace or modify existing records. Continue?
            </p>
            <div className="mt-4 flex gap-3">
              <GhostBtn onClick={() => setRestoreWarn(null)}>Cancel</GhostBtn>
              <PrimaryBtn onClick={doRestore}>Restore now</PrimaryBtn>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 ${card}`}>
        <p className="font-display text-[10px] uppercase tracking-[0.26em] text-white/50">Change Splash Screen</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-white/12 px-5 py-2.5 font-display text-[10px] uppercase tracking-[0.24em] text-white/65 transition hover:border-sky-300/40 hover:text-white">
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && pickSplash(e.target.files[0])}
            />
          </label>
          <PrimaryBtn onClick={saveSplash} disabled={!preview}>
            Save
          </PrimaryBtn>
          <GhostBtn onClick={() => setPreview(null)}>Cancel</GhostBtn>
          <GhostBtn onClick={resetSplash}>Reset to default</GhostBtn>
        </div>
        {preview && (
          <img src={preview} alt="Splash preview" className="mt-5 w-full rounded-xl border border-white/10" />
        )}
        <p className="mt-4 text-[12px] text-white/35">
          The splash screen always displays for 5 seconds, including after changing the image.
        </p>
      </div>

      <div className={`p-6 ${card}`}>
        <p className="font-display text-[10px] uppercase tracking-[0.26em] text-white/50">System Information</p>
        <div className="mt-4 grid gap-3 text-[13px] text-white/60 sm:grid-cols-2">
          <p>Application: ABL VERTEX</p>
          <p>Environment: Production-ready cloud database</p>
          <p>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
          <p>Local time: {new Date().toLocaleString()}</p>
        </div>
        <div className="mt-6">
          <GhostBtn tone="danger" onClick={onLogout}>
            Logout
          </GhostBtn>
        </div>
      </div>
    </div>
  );
}
