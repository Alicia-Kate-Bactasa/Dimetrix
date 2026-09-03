"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Megaphone,
  CheckCircle2,
  XCircle,
  Plus,
  AlertTriangle,
  Send,
  Trash2,
  RefreshCw
} from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { CEBU_AREAS, INCIDENT_TYPES, SEVERITY_OPTIONS, getBarangayListForArea } from "@/lib/cebuAreas";
import { SourceBadge } from "@/components/IncidentBadge";
import StatCard from "@/components/StatCard";
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

export default function Admin() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Official Advisory Form State
  const [showAdvisoryForm, setShowAdvisoryForm] = useState(false);
  const [advArea, setAdvArea] = useState("Lapu-Lapu City");
  const [advBarangay, setAdvBarangay] = useState("");
  const [advType, setAdvType] = useState("power_outage");
  const [advSeverity, setAdvSeverity] = useState("high");
  const [advTitle, setAdvTitle] = useState("");
  const [advDescription, setAdvDescription] = useState("");
  const [advSourceUrl, setAdvSourceUrl] = useState("");
  const [advHouseholds, setAdvHouseholds] = useState("");
  const [submittingAdv, setSubmittingAdv] = useState(false);
  const [advSuccess, setAdvSuccess] = useState(false);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const list = await apiClient.entities.Incident.list("-created_date", 500);
      setIncidents(list || []);
    } catch (e) {
      console.warn("Could not fetch admin incidents", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter((i) => i.status === "active" || i.status === "ongoing").length;
    const pending = incidents.filter((i) => !i.verified || i.verification_status === "unverified").length;
    const official = incidents.filter((i) => i.source_type === "official").length;
    const flagged = incidents.filter((i) => (i.flag_count || 0) > 0).length;
    return { total, active, pending, official, flagged };
  }, [incidents]);

  const pendingQueue = useMemo(() => {
    return incidents.filter((i) => !i.verified || i.verification_status === "unverified");
  }, [incidents]);

  const flaggedQueue = useMemo(() => {
    return incidents.filter((i) => (i.flag_count || 0) > 0);
  }, [incidents]);

  const handleVerify = async (id) => {
    try {
      const updated = await apiClient.entities.Incident.update(id, {
        verified: true,
        verification_status: "verified"
      });
      if (updated) {
        setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
        window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { id } }));
      }
    } catch (e) {
      console.warn("Verify error", e);
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.entities.Incident.delete(id);
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { id } }));
    } catch (e) {
      console.warn("Reject error", e);
    }
  };

  const handleResolve = async (id) => {
    try {
      const updated = await apiClient.entities.Incident.update(id, {
        status: "restored"
      });
      if (updated) {
        setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
        window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { id } }));
      }
    } catch (e) {
      console.warn("Resolve error", e);
    }
  };

  const handleDismissFlags = async (id) => {
    try {
      const updated = await apiClient.entities.Incident.update(id, { flag_count: 0 });
      if (updated) {
        setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
      }
    } catch (e) {
      console.warn("Dismiss flags error", e);
    }
  };

  const handlePurgeRestored = async () => {
    if (!window.confirm("Are you sure you want to clear all restored incidents to declutter the map & feed?")) return;
    try {
      const remaining = await apiClient.entities.Incident.purgeRestored();
      setIncidents(remaining || []);
      window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { action: "purge" } }));
    } catch (e) {
      console.warn("Purge error", e);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Reset all incident data back to initial state?")) return;
    try {
      const defaults = await apiClient.entities.Incident.resetDefaults();
      setIncidents(defaults || []);
      window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { action: "reset" } }));
    } catch (e) {
      console.warn("Reset error", e);
    }
  };

  const handleCreateOfficialAdvisory = async (e) => {
    e.preventDefault();
    if (!advTitle.trim()) return;

    setSubmittingAdv(true);

    const officialAdvisory = {
      id: "inc-official-" + Date.now(),
      title: advTitle.trim(),
      type: advType,
      severity: advSeverity,
      area: advArea,
      barangay: advBarangay || "",
      source_type: "official",
      verification_status: "official",
      verified: true,
      source_url: advSourceUrl.trim(),
      description: advDescription.trim(),
      affected_households: advHouseholds ? Number(advHouseholds) : 0,
      reporter_name: "Official Public Notice",
      status: "active",
      confirmations_count: 1,
      flag_count: 0,
      start_time: new Date().toISOString(),
      created_date: new Date().toISOString()
    };

    try {
      await apiClient.entities.Incident.create(officialAdvisory);
      window.dispatchEvent(new CustomEvent("dimetrix-incident-created", { detail: officialAdvisory }));
      setAdvSuccess(true);
      setTimeout(() => {
        setAdvSuccess(false);
        setShowAdvisoryForm(false);
        setAdvTitle("");
        setAdvDescription("");
        setAdvSourceUrl("");
        loadIncidents();
      }, 1500);
    } catch (e) {
      console.warn("Advisory submit error", e);
    } finally {
      setSubmittingAdv(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Moderation & Official Layer
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage community reports, publish official advisories, and handle flagged items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowAdvisoryForm((v) => !v)}
            className="h-11 px-4 rounded-xl font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Post Official Advisory
          </Button>
          <Button
            variant="outline"
            onClick={handlePurgeRestored}
            className="h-11 px-3 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground"
            title="Clear all restored incidents to declutter"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear Restored
          </Button>
          <Button
            variant="outline"
            onClick={loadIncidents}
            className="h-11 px-3 rounded-xl font-bold text-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Incidents" value={loading ? "—" : stats.total} icon={ShieldCheck} delay={0} />
        <StatCard label="Active Outages" value={loading ? "—" : stats.active} icon={AlertTriangle} accent delay={0.05} />
        <StatCard label="Official Advisories" value={loading ? "—" : stats.official} icon={Megaphone} delay={0.1} />
        <StatCard label="Flagged Reports" value={loading ? "—" : stats.flagged} icon={ShieldAlert} delay={0.15} />
      </div>

      {/* Post Official Advisory Form Drawer */}
      <AnimatePresence>
        {showAdvisoryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-3xl border border-amber-500/30 bg-card p-6 space-y-4 shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-base text-foreground">
                  Publish Official Public Advisory
                </h2>
              </div>
              <button onClick={() => setShowAdvisoryForm(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficialAdvisory} className="space-y-4">
              {advSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Advisory published live to map.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="font-bold text-xs">City / Area *</Label>
                  <Select value={advArea} onValueChange={(val) => { setAdvArea(val); setAdvBarangay(""); }}>
                    <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CEBU_AREAS.map((a) => (
                        <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="font-bold text-xs">Barangay (Optional)</Label>
                  <Select value={advBarangay} onValueChange={setAdvBarangay}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBarangayListForArea(advArea).map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="font-bold text-xs">Advisory Headline *</Label>
                  <Input
                    value={advTitle}
                    onChange={(e) => setAdvTitle(e.target.value)}
                    placeholder="e.g. Official Emergency Line Maintenance in Lapu-Lapu"
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-bold text-xs">Official Source Link *</Label>
                  <Input
                    value={advSourceUrl}
                    onChange={(e) => setAdvSourceUrl(e.target.value)}
                    placeholder="https://facebook.com/advisories/..."
                    className="h-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="font-bold text-xs">Outage Type *</Label>
                  <Select value={advType} onValueChange={setAdvType}>
                    <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map((t) => (
                        <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="font-bold text-xs">Severity *</Label>
                  <Select value={advSeverity} onValueChange={setAdvSeverity}>
                    <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEVERITY_OPTIONS.map((s) => (
                        <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-bold text-xs">Advisory Details</Label>
                <Textarea
                  value={advDescription}
                  onChange={(e) => setAdvDescription(e.target.value)}
                  placeholder="Official details (affected areas, estimated restoration time)..."
                  className="rounded-xl"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={() => setShowAdvisoryForm(false)} className="h-10 rounded-xl font-bold text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingAdv} className="h-10 rounded-xl font-bold text-xs">
                  <Send className="w-4 h-4 mr-1.5" /> Publish Advisory
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Moderation Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Reports */}
        <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-bold text-sm">Pending Moderation Queue ({pendingQueue.length})</h2>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {pendingQueue.map((inc) => (
              <div key={inc.id} className="p-3.5 rounded-2xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{inc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {inc.area} {inc.barangay ? `(${inc.barangay})` : ""} · By {inc.reporter_name || "Community Member"}
                    </p>
                  </div>
                  <SourceBadge sourceType={inc.source_type} />
                </div>

                {inc.description && (
                  <p className="text-xs text-foreground/80 bg-background p-2 rounded-xl border border-border">
                    {inc.description}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleVerify(inc.id)}
                    className="h-8 px-3 text-xs font-bold rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(inc.id)}
                    className="h-8 px-3 text-xs font-bold text-rose-500 border-rose-500/30 hover:bg-rose-500/10 rounded-lg"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}

            {pendingQueue.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No reports requiring moderation review.
              </div>
            )}
          </div>
        </div>

        {/* Flagged Reports */}
        <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-bold text-sm">Flagged Reports ({flaggedQueue.length})</h2>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {flaggedQueue.map((inc) => (
              <div key={inc.id} className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500">
                      Flagged {inc.flag_count} times
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{inc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {inc.area} {inc.barangay ? `(${inc.barangay})` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDismissFlags(inc.id)}
                    className="h-8 px-3 text-xs font-bold rounded-lg"
                  >
                    Dismiss Flags
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(inc.id)}
                    className="h-8 px-3 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Report
                  </Button>
                </div>
              </div>
            ))}

            {flaggedQueue.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No reports flagged for false information.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incident Resolution Table */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-bold text-sm">All Incident Management ({incidents.length})</h2>
        </div>

        <div className="overflow-x-auto max-h-[380px] overflow-y-auto rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-card z-10 border-b border-border">
              <tr className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Title & Location</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-xs text-foreground">{inc.title}</p>
                    <p className="text-[10px] text-muted-foreground">{inc.area} {inc.barangay ? `(${inc.barangay})` : ""}</p>
                  </td>
                  <td className="py-2.5 px-3">
                    <SourceBadge sourceType={inc.source_type} />
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold">
                    {inc.status}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inc.status !== "restored" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(inc.id)}
                          className="h-7 px-2.5 text-[10px] font-bold rounded-lg"
                        >
                          Mark Restored
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(inc.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                        title="Delete incident"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
