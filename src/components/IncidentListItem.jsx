"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { TypeBadge, StatusBadge, SourceBadge } from "@/components/IncidentBadge";

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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(incident)}
      className={`w-full text-left rounded-2xl border p-3.5 transition-all ${
        isSel
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/80 bg-card hover:border-foreground/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <SourceBadge sourceType={incident.source_type} />
            <TypeBadge type={incident.type} />
          </div>
          
          <p className="font-bold text-sm leading-snug truncate text-foreground">{incident.title}</p>
          
          <p className="text-xs text-muted-foreground">
            {incident.area} {incident.barangay ? `· ${incident.barangay}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={incident.status} />
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {timeAgo(incident.start_time || incident.created_date)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}