import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Megaphone, X, Zap, MapPin, Building2, Layers } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { CEBU_AREAS, INCIDENT_TYPES, areaDetails } from "@/lib/cebuAreas";
import MapView from "@/components/MapView";
import IncidentListItem from "@/components/IncidentListItem";
import { TypeBadge, StatusBadge, SeverityDot } from "@/components/IncidentBadge";
import { Button, Input } from "@/components/ui";

const MOCK_INCIDENTS = [
  {
    id: "inc-101",
    title: "Unscheduled Power Outage in Lahug",
    type: "power_outage",
    status: "active",
    severity: "high",
    area: "Lahug",
    description: "Transformer anomaly near IT Park. Utility crews responding.",
    affected_households: 420,
    verified: true,
    created_date: new Date().toISOString(),
    start_time: new Date().toISOString(),
    latitude: 10.328,
    longitude: 123.905
  },
  {
    id: "inc-102",
    title: "Low Voltage Anomaly near Banilad",
    type: "scheduled_brownout",
    status: "ongoing",
    severity: "medium",
    area: "Banilad",
    description: "Brownout reported across residential blocks.",
    affected_households: 180,
    verified: false,
    created_date: new Date(Date.now() - 3600000).toISOString(),
    start_time: new Date(Date.now() - 3600000).toISOString(),
    latitude: 10.342,
    longitude: 123.912
  },
  {
    id: "inc-103",
    title: "Scheduled Maintenance Outage in Mandaue",
    type: "scheduled_brownout",
    status: "scheduled",
    severity: "low",
    area: "Mandaue",
    description: "Substation upgrade work scheduled by power cooperative.",
    affected_households: 1200,
    verified: true,
    created_date: new Date(Date.now() - 7200000).toISOString(),
    start_time: new Date(Date.now() - 7200000).toISOString(),
    latitude: 10.3301,
    longitude: 123.9392
  },
  {
    id: "inc-104",
    title: "Power Restored in Guadalupe Block 4",
    type: "power_outage",
    status: "restored",
    severity: "low",
    area: "Guadalupe",
    description: "Main line fuse replaced; grid stability restored.",
    affected_households: 250,
    verified: true,
    created_date: new Date(Date.now() - 18000000).toISOString(),
    start_time: new Date(Date.now() - 18000000).toISOString(),
    latitude: 10.321,
    longitude: 123.882
  }
];

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "active", label: "Live now" },
  { key: "scheduled", label: "Scheduled" },
  { key: "restored", label: "Restored" }
];

export default function Home() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const load = async () => {
    let localReports = [];
    try {
      localReports = JSON.parse(localStorage.getItem("dimetrix_user_reports") || "[]");
    } catch (e) {}

    try {
      if (apiClient?.entities?.Incident?.list) {
        const data = await apiClient.entities.Incident.list("-created_date", 200);
        if (data && data.length > 0) {
          const combined = [...localReports, ...data];
          // deduplicate by id
          const unique = Array.from(new Map(combined.map(i => [i.id, i])).values());
          setIncidents(unique);
          return;
        }
      }
    } catch (e) {
      console.warn("Using local mock incidents data:", e);
    }

    if (localReports.length > 0) {
      const combined = [...localReports, ...MOCK_INCIDENTS];
      const unique = Array.from(new Map(combined.map(i => [i.id, i])).values());
      setIncidents(unique);
    }
  };

  useEffect(() => {
    load();

    const handleNewIncident = (e) => {
      if (e.detail) {
        setIncidents((prev) => [e.detail, ...prev.filter(i => i.id !== e.detail.id)]);
      }
    };

    window.addEventListener("dimetrix-incident-created", handleNewIncident);
    return () => window.removeEventListener("dimetrix-incident-created", handleNewIncident);
  }, []);

  const handleOpenReportModal = () => {
    window.dispatchEvent(new CustomEvent("open-report-modal"));
    navigate("/?report=" + Date.now());
  };

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (statusFilter !== "all" && inc.status !== statusFilter) return false;
      if (typeFilter !== "all" && inc.type !== typeFilter) return false;
      if (areaFilter !== "all" && inc.area !== areaFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(`${inc.title} ${inc.area} ${inc.description || ""}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [incidents, statusFilter, typeFilter, areaFilter, query]);

  const liveCount = incidents.filter((i) => i.status === "active" || i.status === "ongoing").length;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-5"
      >
        <div className="min-w-0">
          <h1 className="font-hero font-bold tracking-tight text-3xl sm:text-5xl leading-[1.08] text-balance">
            See the dark before <br className="hidden sm:block" />
            <span className="text-primary">it reaches you.</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-3 max-w-lg">
            One honest map of Cebu's outages, brownouts, and blown transformers — reported by neighbors, verified by the community.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:shrink-0">
          <div className="inline-flex items-center justify-center gap-2.5 px-5 h-12 rounded-xl bg-accent text-accent-foreground font-hero font-bold border border-white/10 shadow-sm">
            <span className="text-2xl font-bold text-primary tabular-nums leading-none">{liveCount}</span>
            <span className="text-xs font-bold tracking-wider uppercase text-white leading-tight">
              Active now
            </span>
          </div>
          <Button size="lg" onClick={handleOpenReportModal} className="h-12 py-0 px-6 rounded-xl font-hero font-bold text-sm w-full sm:w-auto shadow-md">
            <Megaphone className="w-4 h-4 mr-2" /> Report an outage
          </Button>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an area, street, or what happened…"
            className="pl-9 h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-xl p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 h-9 rounded-lg font-body text-xs tracking-wide transition-colors ${
                  statusFilter === f.key ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-11 font-hero font-bold" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl border border-border bg-card p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-hero font-bold text-[11px] tracking-widest uppercase text-muted-foreground mb-2">Incident type</p>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>All</Chip>
                  {INCIDENT_TYPES.map((t) => (
                    <Chip key={t.key} active={typeFilter === t.key} onClick={() => setTypeFilter(t.key)} color={t.color}>
                      {t.short}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-hero font-bold text-[11px] tracking-widest uppercase text-muted-foreground mb-2">Area</p>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 font-body text-sm"
                >
                  <option value="all">All of Cebu</option>
                  {CEBU_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transparent Location Coverage Callout when area filter is selected */}
      {areaFilter !== "all" && (() => {
        const info = areaDetails(areaFilter);
        if (!info) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-hero font-bold text-sm text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> {info.name} Location Coverage
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-hero font-bold text-[10px]">
                  {info.provider}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {info.coverageDescription}
              </p>
            </div>
            {info.landmarks && (
              <div className="flex flex-wrap gap-1 shrink-0">
                {info.landmarks.slice(0, 4).map((lm) => (
                  <span key={lm} className="px-2 py-1 rounded-lg bg-card border border-border text-[10px] font-body text-foreground/80">
                    📍 {lm}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* Map + list */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-4 h-[640px]">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-muted min-h-[300px]">
          <MapView incidents={filtered} selected={selected} onSelect={setSelected} />
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm z-[600]">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="absolute inset-0 grid place-items-center z-[600] pointer-events-none">
              <div className="bg-white/90 rounded-2xl px-5 py-4 text-center shadow-lg">
                <Zap className="w-6 h-6 text-primary mx-auto" />
                <p className="font-hero font-bold text-lg mt-2">All clear here</p>
                <p className="font-body text-xs text-muted-foreground">No reports match your filters yet.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col rounded-3xl border border-border bg-card overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="font-hero font-bold text-sm tracking-wide">Reports</p>
            <span className="font-body text-[11px] text-muted-foreground">{filtered.length} shown</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map((inc) => (
              <IncidentListItem key={inc.id} incident={inc} onSelect={setSelected} selected={selected} />
            ))}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground font-body text-sm">
                Nothing to show — try widening your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] max-h-[85vh] overflow-y-auto z-[1200] rounded-3xl border border-border bg-card shadow-2xl p-5 space-y-3"
          >
            <button onClick={() => setSelected(null)} className="absolute top-3.5 right-3.5 p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 flex-wrap pr-8">
              <TypeBadge type={selected.type} />
              <StatusBadge status={selected.status} />
            </div>

            <div>
              <h3 className="font-hero font-bold text-xl pr-6 leading-tight text-foreground">{selected.title}</h3>
              <p className="flex items-center gap-1 font-body text-xs text-primary font-bold mt-1">
                <MapPin className="w-3.5 h-3.5" /> {selected.area}
              </p>
            </div>

            {selected.description && (
              <p className="font-body text-xs text-foreground/90 leading-relaxed p-3 rounded-2xl bg-muted/50 border border-border">
                {selected.description}
              </p>
            )}

            {/* Transparent Location Coverage Box */}
            {(() => {
              const info = areaDetails(selected.area);
              if (!info) return null;
              return (
                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-hero font-bold text-[11px] uppercase tracking-wider text-primary flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Grid Provider
                    </span>
                    <span className="font-hero font-bold text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {info.provider}
                    </span>
                  </div>

                  <p className="font-body text-[11px] text-foreground/90 leading-snug">
                    <strong className="text-foreground">Coverage:</strong> {info.coverageDescription}
                  </p>

                  {info.barangays && (
                    <div className="pt-1 border-t border-primary/15 space-y-1">
                      <p className="font-hero font-bold text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3 text-primary" /> Barangays in Zone
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {info.barangays.slice(0, 6).map((b) => (
                          <span key={b} className="px-2 py-0.5 rounded-md bg-background text-foreground/80 text-[10px] font-body border border-border">
                            {b}
                          </span>
                        ))}
                        {info.barangays.length > 6 && (
                          <span className="text-[10px] text-muted-foreground font-body">+{info.barangays.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
              <SeverityDot severity={selected.severity} />
              {selected.affected_households ? (
                <span className="font-body text-[11px] text-muted-foreground">{selected.affected_households} homes affected</span>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full font-hero font-bold text-xs border transition-colors ${
        active ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </button>
  );
}