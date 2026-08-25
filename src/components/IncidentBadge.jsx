import { typeMeta, statusMeta, severityMeta } from "@/lib/cebuAreas";

export function TypeBadge({ type, className = "" }) {
  const m = typeMeta(type);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-body tracking-wide ${className}`}
      style={{ backgroundColor: `${m.color}1a`, color: m.color, border: `1px solid ${m.color}33` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {m.short}
    </span>
  );
}

export function StatusBadge({ status, className = "" }) {
  const m = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-body tracking-wide ${className}`}
      style={{ backgroundColor: `${m.color}1a`, color: m.color, border: `1px solid ${m.color}33` }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  );
}

export function SeverityDot({ severity, className = "" }) {
  const m = severityMeta(severity);
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-body text-muted-foreground ${className}`}>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 h-3 rounded-sm"
            style={{ backgroundColor: i <= m.weight ? "#dc2626" : "#e5e5e5" }}
          />
        ))}
      </span>
      {m.label}
    </span>
  );
}