"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Send, CheckCircle2, AlertCircle, ThumbsUp, AlertTriangle } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import {
  CEBU_AREAS,
  INCIDENT_TYPES,
  SEVERITY_OPTIONS,
  areaCoords,
  getBarangayListForArea
} from "@/lib/cebuAreas";
import { findDuplicateIncident } from "@/lib/duplicateDetection";
import LocationPicker from "@/components/LocationPicker";
import SpammerNotice from "@/components/SpammerNotice";
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const RATE_LIMIT_SECONDS = 120; // 2 minutes between reports

export default function ReportIncidentForm({ onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [area, setArea] = useState("Cebu City");
  const [barangay, setBarangay] = useState("");
  const [type, setType] = useState("power_outage");
  const [severity, setSeverity] = useState("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [households, setHouseholds] = useState("");
  const [reporter, setReporter] = useState(user?.full_name || "");
  const [location, setLocation] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [doneMessage, setDoneMessage] = useState("Salamat! Report received.");
  const [errorMsg, setErrorMsg] = useState("");
  const [allIncidents, setAllIncidents] = useState([]);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await apiClient.entities.Incident.list();
        setAllIncidents(list || []);
      } catch (e) {
        console.warn("Could not load incidents for duplicate check", e);
      }
    })();
  }, []);

  const handleAreaChange = (selectedArea) => {
    setArea(selectedArea);
    setBarangay("");
    setErrorMsg("");
    setIgnoreDuplicate(false);
    const coords = areaCoords(selectedArea);
    setLocation({ lat: coords.lat, lng: coords.lng });
  };

  const handleLocationChange = (newLoc) => {
    setLocation(newLoc);
    setErrorMsg("");
    setIgnoreDuplicate(false);
  };

  const barangayList = useMemo(() => {
    return getBarangayListForArea(area);
  }, [area]);

  const duplicateIncident = useMemo(() => {
    if (ignoreDuplicate) return null;
    const currentLoc = location || areaCoords(area);
    return findDuplicateIncident(
      {
        area,
        barangay,
        type,
        latitude: currentLoc.lat,
        longitude: currentLoc.lng
      },
      allIncidents
    );
  }, [area, barangay, type, location, allIncidents, ignoreDuplicate]);

  const handleConfirmDuplicate = async () => {
    if (!duplicateIncident) return;
    setSubmitting(true);
    try {
      await apiClient.entities.Incident.addConfirmation(duplicateIncident.id);
      window.dispatchEvent(new CustomEvent("dimetrix-incident-updated", { detail: { id: duplicateIncident.id } }));
      setDoneMessage(`Confirmed outage at ${duplicateIncident.area}. Thank you!`);
      setDone(true);
      setTimeout(() => {
        if (typeof onSuccess === "function") onSuccess();
        else router.push("/");
      }, 1600);
    } catch (e) {
      setErrorMsg("Failed to confirm incident. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please type a short headline describing what happened.");
      return;
    }

    const lastReportTime = localStorage.getItem("dimetrix_last_report_ts");
    if (lastReportTime) {
      const elapsed = (Date.now() - Number(lastReportTime)) / 1000;
      if (elapsed < RATE_LIMIT_SECONDS) {
        const remain = Math.ceil(RATE_LIMIT_SECONDS - elapsed);
        setErrorMsg(`Please wait ${remain}s before submitting another report.`);
        return;
      }
    }

    setSubmitting(true);
    setErrorMsg("");

    const selectedArea = area || "Cebu City";
    const defaultCoords = areaCoords(selectedArea);
    const finalLoc = location || { lat: defaultCoords.lat, lng: defaultCoords.lng };

    const newIncident = {
      id: "inc-" + Date.now(),
      title: title.trim(),
      type,
      severity,
      area: selectedArea,
      barangay: barangay || barangayList[0] || "",
      source_type: "community",
      verification_status: "verified",
      verified: true,
      confirmations_count: 1,
      flag_count: 0,
      description: description.trim(),
      affected_households: households ? Number(households) : 0,
      reporter_name: reporter.trim() || user?.full_name || "Community Member",
      latitude: finalLoc.lat,
      longitude: finalLoc.lng,
      status: "active",
      start_time: new Date().toISOString(),
      created_date: new Date().toISOString()
    };

    try {
      localStorage.setItem("dimetrix_last_report_ts", Date.now().toString());
      await apiClient.entities.Incident.create(newIncident);
      window.dispatchEvent(new CustomEvent("dimetrix-incident-created", { detail: newIncident }));
      
      setDoneMessage("Salamat! Your report is live on the map.");
      setDone(true);

      setTimeout(() => {
        if (typeof onSuccess === "function") onSuccess();
        else router.push("/");
      }, 1600);
    } catch (e) {
      setErrorMsg("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-card p-8 text-center space-y-3 shadow-sm"
      >
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <h3 className="font-hero font-bold text-xl text-foreground">{doneMessage}</h3>
        <p className="font-body text-xs text-muted-foreground max-w-xs mx-auto">
          Neighbors in your area can now see this report on the map.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Duplicate Alert Notice */}
      <AnimatePresence>
        {duplicateIncident && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs"
          >
            <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Similar Outage Reported Nearby</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  "{duplicateIncident.title}" in {duplicateIncident.area} ({duplicateIncident.confirmations_count || 1} confirmed)
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmDuplicate}
                disabled={submitting}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs h-8 rounded-lg flex-1"
              >
                <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Confirm Outage (+1)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIgnoreDuplicate(true)}
                className="font-bold text-xs h-8 rounded-lg border-amber-500/30"
              >
                Submit New
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City & Barangay Selection */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="font-bold text-xs">City / Area *</Label>
          <Select value={area} onValueChange={handleAreaChange}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              {CEBU_AREAS.map((a) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-xs">Barangay (Optional)</Label>
          <Select value={barangay} onValueChange={setBarangay}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder={barangayList.length > 0 ? "Select Barangay" : "Select Area first"} />
            </SelectTrigger>
            <SelectContent>
              {barangayList.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pin Drop Map Location */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-xs">Location Pin (Tap map to adjust)</Label>
          {location && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-primary" /> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          )}
        </div>
        <LocationPicker area={area} value={location} onChange={handleLocationChange} className="h-48" />
      </div>

      {/* Type & Severity */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="font-bold text-xs">Outage Type *</Label>
          <Select value={type} onValueChange={(val) => { setType(val); setIgnoreDuplicate(false); }}>
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
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Headline & Description */}
      <div className="space-y-1">
        <Label className="font-bold text-xs">Headline *</Label>
        <Input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrorMsg(""); }}
          placeholder="e.g. Power outage along Salinas Drive near IT Park"
          className="h-10 rounded-xl"
          required
        />
      </div>

      <div className="space-y-1">
        <Label className="font-bold text-xs">Description (Optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Sparks, loud noise, or how widespread the outage appears..."
          className="rounded-xl"
          rows={2}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="font-bold text-xs">Homes Affected (Est.)</Label>
          <Input
            type="number"
            min={0}
            value={households}
            onChange={(e) => {
              const v = e.target.value;
              setHouseholds(v === "" || Number(v) < 0 ? "" : v);
            }}
            placeholder="e.g. 30"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-xs">Reporter Name (Optional)</Label>
          <Input
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            placeholder="e.g. Resident"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-11 font-bold text-sm rounded-xl shadow-sm transition-transform active:scale-[0.99] mt-2"
      >
        {submitting ? (
          "Submitting Report..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-1.5" /> Submit Outage Report
          </>
        )}
      </Button>

      <SpammerNotice />
    </form>
  );
}