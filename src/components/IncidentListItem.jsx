import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { TypeBadge, StatusBadge, SeverityDot } from "@/components/IncidentBadge";

const timeAgo = (iso) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function IncidentListItem({ incident, onSelect, selected }) {
  const isSel = selected?.id === incident.id;
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(incident)}
      whileHover={{ x: 3 }}
      className={`w-full text-left rounded-2xl border p-3.5 transition-colors ${
        isSel
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-foreground/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-hero font-bold text-sm leading-tight truncate text-foreground">{incident.title}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 font-body">
            <MapPin className="w-3 h-3 text-primary" /> {incident.area}
          </p>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-body whitespace-nowrap">
          <Clock className="w-3 h-3" /> {timeAgo(incident.start_time || incident.created_date)}
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
        <TypeBadge type={incident.type} />
        <StatusBadge type={undefined} status={incident.status} />
        <SeverityDot severity={incident.severity} className="ml-auto" />
      </div>
    </motion.button>
  );
}