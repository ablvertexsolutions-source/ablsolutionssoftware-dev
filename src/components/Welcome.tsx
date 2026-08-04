import { motion } from "framer-motion";

export default function Welcome({
  onVisit,
  onAdmin,
}: {
  onVisit: () => void;
  onAdmin: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[#04070f] px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 60% at 50% 0%, rgba(37,99,235,0.22), transparent 65%), radial-gradient(70% 50% at 50% 110%, rgba(34,211,238,0.12), transparent 65%)",
        }}
      />
      <div className="relative w-full max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="font-display text-[10px] uppercase tracking-[0.4em] text-sky-300/70"
        >
          ABL Vertex
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-[clamp(2rem,6vw,4rem)] font-extralight leading-[1.05] tracking-tight text-gradient"
        >
          WELCOME TO ABL VERTEX
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          className="mx-auto mt-6 max-w-xl text-[13px] leading-relaxed tracking-[0.02em] text-white/50 sm:text-[15px]"
        >
          Business Systems. Software Solutions. Intelligent Automation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={onVisit}
            data-cursor="button"
            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-9 py-4 font-display text-[11px] uppercase tracking-[0.28em] text-white transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
            style={{ boxShadow: "0 20px 60px -20px rgba(37,99,235,0.8)" }}
          >
            Visit Site
          </button>
          <button
            onClick={onAdmin}
            data-cursor="button"
            className="glass w-full rounded-full border border-white/12 px-9 py-4 font-display text-[11px] uppercase tracking-[0.28em] text-white/75 transition-all duration-300 hover:border-sky-300/40 hover:text-white sm:w-auto"
          >
            Admin Site
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
