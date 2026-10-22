"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Megaphone, X, MapPin, ThumbsUp, Flag, ExternalLink, Check } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { CEBU_AREAS, INCIDENT_TYPES, SOURCE_OPTIONS } from "@/lib/cebuAreas";
import MapView from "@/components/MapView";
import IncidentListItem from "@/components/IncidentListItem";
import { TypeBadge, StatusBadge, SourceBadge } from "@/components/IncidentBadge";
import { Button, Input, useToast } from "@/components/ui";

const TABS = [
  { key: "all", label: "Everything" },
  { key: "active", label: "Live Outages" },
  { key: "official", label: "Official Advisories" },
  { key: "scheduled", label: "Scheduled" },
  { key: "restored", label: "Restored" }
];

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [query, setQuery] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      if (apiClient?.entities?.Incident?.list) {
        const data = await apiClient.entities.Incident.list("-created_date", 300);
        if (data && data.length > 0) {
          setIncidents(data);
        }
      }
    } catch (e) {
      console.warn("Error fetching incidents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const handleIncidentChange = () => {
      load();
    };

    window.addEventListener("dimetrix-incident-created", handleIncidentChange);
    window.addEventListener("dimetrix-incident-updated", handleIncidentChange);
    return () => {
      window.removeEventListener("dimetrix-incident-created", handleIncidentChange);
      window.removeEventListener("dimetrix-incident-updated", handleIncidentChange);
    };
  }, []);

  const handleOpenReportModal = () => {
    window.dispatchEvent(new CustomEvent("open-report-modal"));
    router.push("/dashboard?report=" + Date.now());
  };

  const handleConfirmIncident = async (id, updatedData) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to confirm this outage report.",
      });
      router.push("/login");
      return;
    }

    const current = incidents.find((i) => i.id === id);
    if (current?.has_confirmed) {
      toast({
        title: "Already confirmed",
        description: "You have already confirmed this outage report.",
      });
      return;
    }

    if (updatedData) {
      setIncidents((prev) => prev.map((i) => (i.id === id ? updatedData : i)));
      if (selected?.id === id) setSelected(updatedData);
      toast({
        title: "Outage confirmed",
        description: "Thank you for confirming this report (+1).",
      });
      return;
    }

    setActionLoading(true);
    try {
      const updated = await apiClient.entities.Incident.addConfirmation(id);
      if (updated) {
        setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
        if (selected?.id === id) setSelected(updated);
        toast({
          title: "Outage confirmed",
          description: "Thank you for confirming this report (+1).",
        });
      }
    } catch (e) {
      const isAlready = e?.message?.toLowerCase().includes("already confirmed");
      if (isAlready) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === id ? { ...i, has_confirmed: true } : i))
        );
        if (selected?.id === id) setSelected((prev) => ({ ...prev, has_confirmed: true }));
      }
      toast({
        title: isAlready ? "Already confirmed" : "Could not confirm",
        description: e.message || "Failed to confirm outage report.",
        variant: isAlready ? "default" : "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagIncident = async (id) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to flag false reports.",
      });
      router.push("/login");
      return;
    }

    const current = incidents.find((i) => i.id === id);
    if (current?.has_flagged) {
      toast({
        title: "Already flagged",
        description: "You have already flagged this report.",
      });
      return;
    }

    setActionLoading(true);
    try {
      const updated = await apiClient.entities.Incident.flagIncident(id, "False Report");
      if (updated) {
        setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
        if (selected?.id === id) setSelected(updated);
        toast({
          title: "Report flagged",
          description: "Thank you for flagging. Our moderators will review it.",
        });
      }
    } catch (e) {
      const isAlready = e?.message?.toLowerCase().includes("already flagged");
      if (isAlready) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === id ? { ...i, has_flagged: true } : i))
        );
        if (selected?.id === id) setSelected((prev) => ({ ...prev, has_flagged: true }));
      }
      toast({
        title: isAlready ? "Already flagged" : "Could not flag report",
        description: e.message || "Failed to flag incident.",
        variant: isAlready ? "default" : "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (statusFilter === "active" && (inc.status !== "active" && inc.status !== "ongoing")) return false;
      if (statusFilter === "official" && inc.source_type !== "official") return false;
      if (statusFilter === "scheduled" && inc.status !== "scheduled") return false;
      if (statusFilter === "restored" && inc.status !== "restored") return false;

      if (typeFilter !== "all" && inc.type !== typeFilter) return false;
      if (areaFilter !== "all" && inc.area !== areaFilter) return false;
      if (sourceFilter !== "all" && inc.source_type !== sourceFilter) return false;

      if (query) {
        const q = query.toLowerCase();
        const searchTarget = `${inc.title} ${inc.area} ${inc.barangay || ""} ${inc.description || ""}`.toLowerCase();
        if (!searchTarget.includes(q)) return false;
      }

      return true;
    });
  }, [incidents, statusFilter, typeFilter, areaFilter, sourceFilter, query]);

  const liveCount = incidents.filter((i) => i.status === "active" || i.status === "ongoing").length;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Real-Time Power Watch
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Community power outage tracking across Metro Cebu, Mactan Island, and surrounding areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs flex items-center gap-2">
            <span className="text-lg font-bold text-primary tabular-nums leading-none">{liveCount}</span>
            <span>Active Outages</span>
          </div>

          <Button size="lg" onClick={handleOpenReportModal} className="h-11 px-5 rounded-xl font-bold text-xs shadow-sm">
            <Megaphone className="w-4 h-4 mr-1.5" /> Report Outage
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, barangay, or street..."
            className="pl-9 h-11 rounded-xl text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex bg-muted rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3.5 h-9 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === t.key ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button variant="outline" className="h-11 rounded-xl font-bold text-xs shrink-0" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filter Options
          </Button>
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-card p-4 grid sm:grid-cols-3 gap-3">
              <div>
                <p className="font-bold text-xs text-muted-foreground mb-1.5">Report Source</p>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                >
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-bold text-xs text-muted-foreground mb-1.5">City / Area</p>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                >
                  <option value="all">All of Cebu</option>
                  {CEBU_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-bold text-xs text-muted-foreground mb-1.5">Outage Type</p>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                >
                  <option value="all">All Outage Types</option>
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map + List Grid */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-4 h-[640px]">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-muted min-h-[300px]">
          <MapView
            incidents={filtered}
            selected={selected}
            onSelect={setSelected}
            onConfirmIncident={handleConfirmIncident}
          />

          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm z-[600]">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col rounded-3xl border border-border bg-card overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <p className="font-bold text-xs text-foreground uppercase tracking-wider">Outage Reports</p>
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map((inc) => (
              <IncidentListItem key={inc.id} incident={inc} onSelect={setSelected} selected={selected} />
            ))}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No outage reports match your filter selections.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] max-h-[85vh] overflow-y-auto z-[1200] rounded-3xl border border-border bg-card shadow-xl p-5 space-y-4"
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 flex-wrap pr-8">
              <TypeBadge type={selected.type} />
              <StatusBadge status={selected.status} />
              <SourceBadge sourceType={selected.source_type} />
            </div>

            <div>
              <h3 className="font-bold text-lg leading-tight text-foreground">{selected.title}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {selected.area} {selected.barangay ? `(${selected.barangay})` : ""}
              </p>
            </div>

            {selected.description && (
              <p className="text-xs text-foreground/90 leading-relaxed p-3 rounded-2xl bg-muted/40 border border-border">
                {selected.description}
              </p>
            )}

            {selected.source_url && (
              <a
                href={selected.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-bold p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-full hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> View Official Source Link
              </a>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span>Confirmations: <strong className="text-foreground">{selected.confirmations_count || 1}</strong></span>
              {selected.affected_households ? <span>~{selected.affected_households} homes affected</span> : null}
            </div>

            {/* Actions: Confirm or Flag */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              {selected.status !== "restored" && (
                <Button
                  size="sm"
                  disabled={selected.has_confirmed || actionLoading}
                  onClick={() => handleConfirmIncident(selected.id)}
                  className={`h-10 font-bold text-xs rounded-xl ${
                    selected.has_confirmed
                      ? "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/20 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {selected.has_confirmed ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Confirmed
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Confirm (+1)
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={selected.has_flagged || actionLoading}
                onClick={() => handleFlagIncident(selected.id)}
                className={`h-10 font-bold text-xs rounded-xl ${
                  selected.has_flagged
                    ? "text-muted-foreground border-border bg-muted/40 cursor-not-allowed"
                    : "text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
                }`}
              >
                {selected.has_flagged ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" /> Flagged False
                  </>
                ) : (
                  <>
                    <Flag className="w-3.5 h-3.5 mr-1" /> Flag False
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}