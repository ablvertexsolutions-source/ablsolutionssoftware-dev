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
      <button
        onClick={onAdmin}
        data-cursor="button"
        className="glass absolute right-4 top-4 z-10 rounded-full border border-white/12 px-4 py-2 font-display text-[9px] uppercase tracking-[0.24em] text-white/55 transition-all duration-300 hover:border-sky-300/40 hover:text-white sm:right-8 sm:top-8"
      >
        Admin Site
      </button>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center"
        >
          <button
            onClick={onVisit}
            data-cursor="button"
            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-12 py-5 font-display text-[13px] uppercase tracking-[0.32em] text-white transition-transform duration-300 hover:scale-[1.03] sm:w-auto sm:px-16 sm:py-6 sm:text-[15px]"
            style={{ boxShadow: "0 20px 60px -20px rgba(37,99,235,0.8)" }}
          >
            Visit Site
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mx-auto mt-10 max-w-xl text-[13px] leading-relaxed tracking-[0.02em] text-white/45 sm:text-[15px]"
        >
          Business Systems. Software Solutions. Intelligent Automation.
        </motion.p>
      </div>
    </motion.section>
  );
}
