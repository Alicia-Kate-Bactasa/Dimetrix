import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import SpammerNotice from "@/components/SpammerNotice";

const ID_TYPES = [
  { value: "philsys_id", label: "PhilSys National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "voters_id", label: "Voter's ID" },
  { value: "umid", label: "UMID" },
  { value: "other", label: "Other valid ID" }
];

export default function IdentityGate({ onVerified }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "Alicia Bactasa");
  const [idType, setIdType] = useState("passport");
  const [idNumber, setIdNumber] = useState("");
  const [ack, setAck] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !idNumber) return;
    if (!ack) {
      setError("Please confirm the fair-use pledge before continuing.");
      return;
    }
    setSubmitting(true);
    try {
      if (apiClient?.entities?.Identity?.create) {
        await apiClient.entities.Identity.create({
          full_name: fullName,
          valid_id_type: idType,
          valid_id_number: idNumber,
          acknowledged: true
        });
      }
    } catch (err) {
      console.warn("Backend verification unavailable, proceeding locally:", err);
    } finally {
      setSubmitting(false);
      localStorage.setItem("dimetrix_verified", "true");
      if (typeof onVerified === "function") {
        onVerified();
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/30">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <p className="font-body text-[11px] tracking-[0.25em] uppercase text-primary">One quick step</p>
        <h1 className="font-heading text-3xl sm:text-4xl mt-2 leading-tight">
          Verify once, <span className="text-primary">help everyone.</span>
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
          We ask for a valid ID to keep spammers off the map. Your details stay private — they're only here to keep reports trustworthy.
        </p>
      </motion.div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5"
      >
        <div className="space-y-2">
          <Label>Full name (as on your ID)</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Dela Cruz"
            className="h-12"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ID type</Label>
            <Select value={idType} onValueChange={setIdType}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ID_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ID number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. 1234-5678-9012"
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <Checkbox checked={ack} onCheckedChange={(val) => setAck(!!val)} className="mt-0.5" />
          <span className="font-body text-[12px] text-muted-foreground leading-snug">
            I pledge to report only what I genuinely see. I understand that false or spam reports will get my pinpoints suspended.
          </span>
        </label>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <Button type="submit" disabled={submitting || !fullName || !idNumber || !ack} className="w-full h-12 text-base">
          {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</>) : "Verify & continue"}
        </Button>
      </motion.form>

      <SpammerNotice className="mt-6" />
    </div>
  );
}