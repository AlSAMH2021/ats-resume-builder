import { motion } from "framer-motion";

const premiumEase = [0.22, 1, 0.36, 1] as const;

const mockLines = [
  { w: "w-2/3", accent: true },
  { w: "w-1/2", accent: false },
  { w: "w-full", accent: false },
  { w: "w-5/6", accent: false },
  { w: "w-4/6", accent: false },
  { w: "w-1/3", accent: true },
  { w: "w-full", accent: false },
  { w: "w-5/6", accent: false },
  { w: "w-1/3", accent: true },
  { w: "w-full", accent: false },
  { w: "w-3/4", accent: false },
  { w: "w-2/5", accent: false },
];

const ResumeMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8, rotateX: 4 }}
      animate={{ opacity: 1, y: 0, rotateY: -4, rotateX: 2 }}
      transition={{ duration: 0.9, delay: 0.4, ease: premiumEase }}
      className="relative will-change-transform"
      style={{ perspective: "1200px" }}
    >
      {/* Glow behind */}
      <div className="absolute -inset-6 rounded-3xl bg-primary/8 blur-2xl -z-10" />

      {/* Card */}
      <div
        className="w-[280px] sm:w-[320px] rounded-2xl border border-border/50 bg-card p-5 shadow-2xl shadow-primary/10"
        style={{ transform: "rotateY(-2deg) rotateX(1deg)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-primary/40" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-full bg-foreground/15 w-3/4" />
            <div className="h-1.5 rounded-full bg-muted-foreground/10 w-1/2" />
          </div>
        </div>

        <div className="h-px bg-border/60 mb-3" />

        {/* Lines */}
        <div className="space-y-2">
          {mockLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.4, ease: premiumEase }}
              className={`h-1.5 rounded-full ${line.w} ${
                line.accent
                  ? "bg-primary/25"
                  : "bg-muted-foreground/8"
              }`}
            />
          ))}
        </div>

        {/* Footer badge */}
        <div className="mt-4 flex justify-center">
          <div className="text-[9px] font-semibold text-primary/30 tracking-widest uppercase">
            سيرتي | Seeraty
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: premiumEase }}
        className="absolute -top-3 -end-3 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/30"
      >
        ATS ✓
      </motion.div>
    </motion.div>
  );
};

export default ResumeMockup;
