import { motion } from "framer-motion";

export default function StatCard({ label, value, sub, accent = false, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl p-5 border ${
        accent ? "bg-accent text-accent-foreground border-white/10" : "bg-card border-border"
      }`}
    >
      {accent && (
        <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
      )}
      <div className="relative flex items-start justify-between">
        <p className={`font-hero font-bold text-[11px] tracking-widest uppercase ${accent ? "text-white/60" : "text-muted-foreground"}`}>
          {label}
        </p>
        {Icon && <Icon className="w-5 h-5 text-primary" />}
      </div>
      <p className="relative font-hero font-bold text-4xl mt-2 tabular-nums">{value}</p>
      {sub && (
        <p className={`relative font-body text-[11px] mt-1 ${accent ? "text-white/60" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}