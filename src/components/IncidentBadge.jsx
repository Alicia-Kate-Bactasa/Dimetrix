import { typeMeta } from "@/lib/cebuAreas";

/**
 * Ultra-compact, high-utility micro badges.
 */

export function StatusBadge({ status, className = "" }) {
  let label = "Live";
  let style = "bg-rose-600 text-white";

  if (status === "restored") {
    label = "Restored";
    style = "bg-emerald-600 text-white";
  } else if (status === "scheduled") {
    label = "Scheduled";
    style = "bg-amber-600 text-white";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white tracking-wide ${style} ${className}`}>
      {label}
    </span>
  );
}

export function SourceBadge({ sourceType, className = "" }) {
  const isOfficial = sourceType === "official";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white tracking-wide ${
        isOfficial ? "bg-amber-600" : "bg-zinc-700"
      } ${className}`}
    >
      {isOfficial ? "Official" : "Community"}
    </span>
  );
}

export function TypeBadge({ type, className = "" }) {
  const m = typeMeta(type);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white tracking-wide ${className}`}
      style={{ backgroundColor: m.color, color: "#ffffff" }}
    >
      {m.short}
    </span>
  );
}

export function VerificationBadge({ verified, verificationStatus, className = "" }) {
  if (verificationStatus === "unverified" && !verified) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-600 text-white tracking-wide ${className}`}>
        Pending
      </span>
    );
  }
  return null;
}

export function SeverityDot() {
  return null;
}

export function ProviderBadge() {
  return null;
}