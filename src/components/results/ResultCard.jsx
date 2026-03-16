import React from "react";
import { motion } from "framer-motion";
import { Pill, AlertTriangle, Info, ChevronRight } from "lucide-react";
import InteractionBanner from "./InteractionBanner";

function InteractionItem({ interaction, index }) {
  const severityConfig = {
    high: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", label: "High Risk", icon: "text-red-500" },
    medium: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-500", label: "Moderate", icon: "text-yellow-500" },
    low: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-500", label: "Low Risk", icon: "text-green-500" },
  };
  const cfg = severityConfig[interaction.severity] || severityConfig.low;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${cfg.icon}`} />
          <span className="font-medium text-sm text-foreground">{interaction.medication}</span>
        </div>
        <span className={`text-xs font-semibold text-white px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{interaction.description}</p>
    </motion.div>
  );
}

export default function ResultCard({ result }) {
  return (
    <div className="space-y-5">
      <InteractionBanner
        hasDangerousInteraction={result.hasDangerousInteraction}
        interactionCount={result.interactions.length}
      />

      {/* Detected Drug */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Detected Medication</p>
            <h2 className="text-lg font-bold text-foreground">{result.detectedDrug}</h2>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-muted/50 rounded-xl p-3.5">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>
      </motion.div>

      {/* Interactions */}
      {result.interactions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Interaction Details
          </h3>
          {result.interactions.map((interaction, i) => (
            <InteractionItem key={i} interaction={interaction} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}