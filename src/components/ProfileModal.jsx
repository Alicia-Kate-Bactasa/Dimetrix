import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Edit3, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button, Input, Label } from "@/components/ui";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [fullName, setFullName] = useState(user?.full_name || "Alicia Bactasa");
  const [email, setEmail] = useState(user?.email || "alicia@dimetrix.io");
  const [department, setDepartment] = useState(user?.department || "Community Outage Tracker");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      full_name: fullName,
      email: email,
      department: department
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1500] bg-black/70 backdrop-blur-sm flex justify-center items-start pt-10 sm:pt-14 pb-10 p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto custom-modal-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 grid place-items-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-hero font-bold text-xl shadow-lg shadow-primary/30 shrink-0">
              {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hero font-bold text-2xl text-foreground">{user?.full_name || 'Alicia Bactasa'}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hero font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Community Member
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{user?.email || 'alicia@dimetrix.io'}</p>
            </div>
          </div>

          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-hero font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Profile details saved successfully!
            </motion.div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-muted-foreground">Full Name</span>
                  <span className="font-hero font-bold text-sm text-foreground">{user?.full_name || 'Alicia Bactasa'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-body text-xs text-muted-foreground">Email Address</span>
                  <span className="font-hero font-bold text-xs text-foreground">{user?.email || 'alicia@dimetrix.io'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-body text-xs text-muted-foreground">Role / Title</span>
                  <span className="font-hero font-bold text-xs text-foreground">{user?.department || 'Community Outage Tracker'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-body text-xs text-muted-foreground">Account Access</span>
                  <span className="font-hero font-bold text-xs uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {user?.role || 'Admin'}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full h-12 rounded-2xl font-hero font-bold text-sm shadow-md"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile Details
              </Button>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-hero font-bold">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-hero font-bold">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-hero font-bold">Role / Community Title</Label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 rounded-2xl font-hero font-bold text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-2xl font-hero font-bold text-sm shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
