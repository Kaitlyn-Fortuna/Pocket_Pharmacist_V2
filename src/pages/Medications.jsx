import React, { useState, useEffect } from "react";
import { Pill, Plus, Trash2, Clock, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MedicationAutocomplete from "../components/medications/MedicationAutocomplete";
import { motion, AnimatePresence } from "framer-motion";

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "every_other_day", label: "Every other day" },
  { value: "daily", label: "Daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "four_times_daily", label: "Four times daily" },
  { value: "as_needed", label: "As needed" },
];
import { getMedications, addMedication, deleteMedication } from "../components/api/mockApi";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";

export default function Medications() {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    setIsLoading(true);
    const meds = await getMedications();
    setMedications(meds);
    setIsLoading(false);
  };

  const isFormValid = newMed.name.trim() && newMed.dosage.trim() && newMed.frequency.trim();

  const handleAdd = async () => {
    if (!isFormValid) return;
    setIsAdding(true);
    const med = await addMedication(newMed.name.trim(), parseInt(newMed.dosage, 10), newMed.frequency);
    setMedications((prev) => [...prev, med]);
    setNewMed({ name: "", dosage: "", frequency: "" });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    await deleteMedication(id);
  };

  const handleChange = (field, value) => setNewMed((prev) => ({ ...prev, [field]: value }));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Pill className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">My Medications</h1>
          <p className="text-xs text-muted-foreground">Manage your current medication list</p>
        </div>
      </div>

      {/* Add Medication Form */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-sm space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add Medication</p>
        <MedicationAutocomplete
          placeholder="Medication name (e.g. Lisinopril)"
          value={newMed.name}
          onChange={(val) => handleChange("name", val)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Dosage"
              type="number"
              min="1"
              step="1"
              value={newMed.dosage}
              onChange={(e) => handleChange("dosage", e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={handleKeyDown}
              className="h-11 rounded-xl bg-muted/40 border-border text-sm pl-9 pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">mg</span>
          </div>
          <div className="flex-1">
            <Select value={newMed.frequency} onValueChange={(val) => handleChange("frequency", val)}>
              <SelectTrigger className="h-11 rounded-xl bg-muted/40 border-border text-sm">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!isFormValid || isAdding}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 gap-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Adding..." : "Add Medication"}
        </Button>
      </div>

      {/* Medications List */}
      {isLoading ? (
        <LoadingSkeleton variant="medications" />
      ) : medications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-16 text-center"
        >
          <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
            <Pill className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No medications added yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Add your current medications above
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
            {medications.length} medication{medications.length !== 1 ? "s" : ""}
          </p>
          <AnimatePresence>
            {medications.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{med.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {med.dosage && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FlaskConical className="w-3 h-3" />
                        {med.dosage}mg
                      </span>
                    )}
                    {med.frequency && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label ?? med.frequency}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}