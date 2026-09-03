import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { CEBU_AREAS, INCIDENT_TYPES, SEVERITY_OPTIONS, areaCoords } from "@/lib/cebuAreas";
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

export default function ReportIncidentForm({ onSuccess }) {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [type, setType] = useState("power_outage");
  const [severity, setSeverity] = useState("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [households, setHouseholds] = useState("");
  const [reporter, setReporter] = useState("");
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAreaChange = (selectedArea) => {
    setArea(selectedArea);
    setErrorMsg("");
    // Auto-place pin at selected area center if location not manually set
    const coords = areaCoords(selectedArea);
    setLocation({ lat: coords.lat, lng: coords.lng });
  };

  const handleLocationChange = (newLoc) => {
    setLocation(newLoc);
    setErrorMsg("");
  };

  const canSubmit = Boolean(title.trim());

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please type a short headline describing what happened.");
      return;
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
      description: description.trim(),
      affected_households: households ? Number(households) : 0,
      reporter_name: reporter.trim() || "Community Member",
      latitude: finalLoc.lat,
      longitude: finalLoc.lng,
      status: "active",
      start_time: new Date().toISOString(),
      created_date: new Date().toISOString(),
      verified: true
    };

    try {
      // Save locally to localStorage cache so it displays immediately
      try {
        const stored = JSON.parse(localStorage.getItem("dimetrix_user_reports") || "[]");
        localStorage.setItem("dimetrix_user_reports", JSON.stringify([newIncident, ...stored]));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      // Dispatch global event for live update
      window.dispatchEvent(new CustomEvent("dimetrix-incident-created", { detail: newIncident }));

      // Sync report with API client
      if (apiClient?.entities?.Incident?.create) {
        await apiClient.entities.Incident.create(newIncident);
      }
    } catch (e) {
      console.warn("Backend submit notice (using local storage fallback):", e);
    } finally {
      setDone(true);
      setTimeout(() => {
        if (typeof onSuccess === "function") {
          onSuccess();
        } else {
          navigate("/");
        }
      }, 1500);
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-card p-10 text-center space-y-3"
      >
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto animate-bounce" />
        <h3 className="font-hero font-bold text-2xl text-foreground">Salamat! Report received.</h3>
        <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
          Your report is now live on the map — helping your neighbors prepare immediately.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-hero font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-hero font-bold text-foreground">What's happening?</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {INCIDENT_TYPES.map((t) => (
                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-hero font-bold text-foreground">How serious?</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-hero font-bold text-foreground">Which area?</Label>
        <Select value={area} onValueChange={handleAreaChange}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Pick a Cebu area (e.g. Lahug, Mandaue, Lapu-Lapu)" />
          </SelectTrigger>
          <SelectContent>
            {CEBU_AREAS.map((a) => (
              <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-hero font-bold text-foreground">Drop a pin on the exact spot (Optional)</Label>
        <LocationPicker area={area} value={location} onChange={handleLocationChange} />
        <div className="min-h-[1.25rem]">
          {location ? (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground font-body">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Pinned at {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground font-body">
              Selecting an area above automatically pins the map center, or tap the map to fine-tune.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-hero font-bold text-foreground">Give it a short headline *</Label>
        <Input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrorMsg(""); }}
          placeholder="e.g. Whole block dark since 7pm near IT Park"
          className="h-11 rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="font-hero font-bold text-foreground">What should neighbors know? (optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share what you saw, heard, or felt — sparks, loud pops, how wide the outage is…"
          className="rounded-xl"
          rows={3}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-hero font-bold text-foreground">Homes affected (guess is fine)</Label>
          <Input
            type="number"
            value={households}
            onChange={(e) => setHouseholds(e.target.value)}
            placeholder="e.g. 40"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-hero font-bold text-foreground">Your name (optional)</Label>
          <Input
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            placeholder="So we can credit your report"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-12 text-base font-hero font-bold rounded-xl shadow-md transition-transform active:scale-[0.99]"
      >
        {submitting ? (
          "Sending report..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Share with the community
          </>
        )}
      </Button>

      <SpammerNotice />
    </form>
  );
}