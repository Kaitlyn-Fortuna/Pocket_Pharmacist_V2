import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function InteractionBanner({ hasDangerousInteraction, interactionCount }) {
  const config = hasDangerousInteraction
    ? {
        bg: "bg-red-50 border-red-200",
        icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
        title: "Dangerous Interaction Detected",
        subtitle: `${interactionCount} interaction${interactionCount !== 1 ? "s" : ""} found with your medications`,
        accent: "bg-red-500",
        textColor: "text-red-800",
        subtitleColor: "text-red-600",
      }
    : {
        bg: "bg-green-50 border-green-200",
        icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
        title: "No Dangerous Interactions",
        subtitle: "This medication appears safe with your current medications",
        accent: "bg-green-500",
        textColor: "text-green-800",
        subtitleColor: "text-green-600",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border ${config.bg} p-4`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accent} rounded-l-2xl`} />
      <div className="flex items-start gap-3 pl-2">
        <div className="mt-0.5">{config.icon}</div>
        <div>
          <p className={`font-semibold ${config.textColor}`}>{config.title}</p>
          <p className={`text-sm mt-0.5 ${config.subtitleColor}`}>{config.subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}