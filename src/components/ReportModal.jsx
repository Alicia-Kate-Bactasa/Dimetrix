import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, Heart, ShieldCheck } from "lucide-react";
import ReportIncidentForm from "@/components/ReportIncidentForm";

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1500] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] p-6 sm:p-9 shadow-2xl my-auto max-h-[90vh] overflow-y-auto custom-modal-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 grid place-items-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 text-center pr-6 sm:pr-0">
            <div className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground mb-3 shadow-lg shadow-primary/30 mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>
            <h2 className="font-hero font-bold text-2xl sm:text-3xl leading-tight">
              Tell the neighborhood <span className="text-primary">what you see.</span>
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Your report lands on the map in seconds — so families nearby can prepare.
            </p>
          </div>

          {/* Report Form */}
          <ReportIncidentForm onSuccess={onClose} />

          {/* Footer Trust badging */}
          <div className="grid sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
            <div className="rounded-2xl border border-border bg-muted/40 p-4 flex gap-3">
              <Heart className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-hero font-bold text-xs">Community-powered</p>
                <p className="font-body text-[11px] text-muted-foreground leading-snug mt-0.5">Real reports from neighbors.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4 flex gap-3">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-hero font-bold text-xs">Verified over time</p>
                <p className="font-body text-[11px] text-muted-foreground leading-snug mt-0.5">Checked by the community.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
