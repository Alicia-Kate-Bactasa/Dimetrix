import { ShieldAlert } from "lucide-react";

export default function SpammerNotice({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-primary/30 bg-primary/5 p-4 flex gap-3 ${className}`}>
      <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-hero font-bold text-sm text-foreground">Fair play keeps the map honest</p>
        <p className="font-body text-[12px] text-muted-foreground mt-1 leading-snug">
          Dimetrix watches for spam and suspicious reports. Accounts caught abusing the map will have
          their pinpoints suspended — no warnings, no second chances.
        </p>
      </div>
    </div>
  );
}