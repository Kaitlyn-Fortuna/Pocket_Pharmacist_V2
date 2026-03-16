import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Pill, Search, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ------------------------------------------------------------------
// Replace this with a real API call to your database / drug formulary
// e.g. GET /medications/search?q={query}  →  [{ name, generic, form }]
// ------------------------------------------------------------------
async function searchMedicationDatabase(query) {
  await new Promise((r) => setTimeout(r, 250)); // simulate network
  const MOCK_DRUGS = [
    { name: "Acetaminophen", generic: "Acetaminophen", form: "Tablet" },
    { name: "Amoxicillin", generic: "Amoxicillin", form: "Capsule" },
    { name: "Atorvastatin", generic: "Atorvastatin", form: "Tablet" },
    { name: "Azithromycin", generic: "Azithromycin", form: "Tablet" },
    { name: "Ciprofloxacin", generic: "Ciprofloxacin", form: "Tablet" },
    { name: "Clopidogrel", generic: "Clopidogrel", form: "Tablet" },
    { name: "Doxycycline", generic: "Doxycycline", form: "Capsule" },
    { name: "Escitalopram", generic: "Escitalopram", form: "Tablet" },
    { name: "Furosemide", generic: "Furosemide", form: "Tablet" },
    { name: "Gabapentin", generic: "Gabapentin", form: "Capsule" },
    { name: "Hydrochlorothiazide", generic: "HCTZ", form: "Tablet" },
    { name: "Ibuprofen", generic: "Ibuprofen", form: "Tablet" },
    { name: "Levothyroxine", generic: "Levothyroxine", form: "Tablet" },
    { name: "Lisinopril", generic: "Lisinopril", form: "Tablet" },
    { name: "Losartan", generic: "Losartan", form: "Tablet" },
    { name: "Metformin", generic: "Metformin", form: "Tablet" },
    { name: "Metoprolol", generic: "Metoprolol Succinate", form: "Tablet" },
    { name: "Omeprazole", generic: "Omeprazole", form: "Capsule" },
    { name: "Pantoprazole", generic: "Pantoprazole", form: "Tablet" },
    { name: "Prednisone", generic: "Prednisone", form: "Tablet" },
    { name: "Sertraline", generic: "Sertraline", form: "Tablet" },
    { name: "Simvastatin", generic: "Simvastatin", form: "Tablet" },
    { name: "Warfarin", generic: "Warfarin", form: "Tablet" },
  ];
  const q = query.toLowerCase();
  return MOCK_DRUGS.filter((d) => d.name.toLowerCase().startsWith(q)).slice(0, 6);
}

export default function MedicationAutocomplete({ value, onChange, onKeyDown, placeholder }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (value.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceRef.current);
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const hits = await searchMedicationDatabase(value.trim());
      setResults(hits);
      setShowDropdown(hits.length > 0);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (drugName) => {
    onChange(drugName);
    setShowDropdown(false);
    setResults([]);
  };

  const highlight = (text) => {
    const idx = text.toLowerCase().indexOf(value.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        <span className="text-muted-foreground">{text.slice(0, idx)}</span>
        <span className="text-foreground font-semibold">{text.slice(idx, idx + value.length)}</span>
        <span className="text-muted-foreground">{text.slice(idx + value.length)}</span>
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          className="h-11 rounded-xl bg-muted/40 border-border text-sm pl-9 pr-9"
          autoComplete="off"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin pointer-events-none" />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            {results.map((drug, i) => (
              <button
                key={drug.name}
                type="button"
                onMouseDown={() => handleSelect(drug.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors ${
                  i < results.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <Pill className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">{highlight(drug.name)}</p>
                  <p className="text-xs text-muted-foreground">{drug.form}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}