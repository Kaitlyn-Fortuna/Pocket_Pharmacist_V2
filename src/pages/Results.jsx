import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Camera, Pill, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ResultCard from "../components/results/ResultCard";

/** @param {string} medicationName */
async function fetchFDAInfo(medicationName) {
  if (!medicationName) return null;
  const encoded = encodeURIComponent(`"${medicationName}"`);
  try {
    let res = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encoded}&limit=1`
    );
    if (!res.ok) {
      res = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encoded}&limit=1`
      );
    }
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * @param {{ label: string; text: string; accent?: "red" | "yellow" | "orange" }} props
 */
function FDARow({ label, text, accent = "none" }) {
  const [expanded, setExpanded] = useState(false);
  const truncated = text?.length > 300;
  const display = expanded || !truncated ? text : text.slice(0, 300) + "…";

  const accentMap = {
    red: "border-l-red-500 bg-red-500/5",
    yellow: "border-l-yellow-500 bg-yellow-500/5",
    orange: "border-l-orange-500 bg-orange-500/5",
    none: "border-l-border bg-muted/30",
  };
  const accentClass = accentMap[accent] ?? accentMap.none;

  return (
    <div className={`rounded-lg border-l-2 px-3 py-2 ${accentClass}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{display}</p>
      {truncated && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[11px] text-primary mt-1 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

/** @param {{ medicationName: string | null }} props */
function FDASays({ medicationName }) {
  const [fdaData, setFdaData] = useState(/** @type {Record<string, any> | null} */ (null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!medicationName) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    fetchFDAInfo(medicationName).then((data) => {
      if (!data?.results?.length) {
        setError(true);
      } else {
        setFdaData(data.results[0]);
      }
      setLoading(false);
    });
  }, [medicationName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-5 rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">What the FDA Says</span>
        <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
          openFDA
        </span>
      </div>

      <div className="px-4 py-3 space-y-4">
        {loading && (
          <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Looking up FDA data…</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 py-3 text-muted-foreground">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
            <p className="text-sm">
              No FDA label data found for{" "}
              <span className="font-medium text-foreground">{medicationName ?? "this drug"}</span>.
              Try the{" "}
              
                href="https://www.accessdata.fda.gov/scripts/cder/daf/"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                FDA Drug Database
              </a>
              .
            </p>
          </div>
        )}

        {!loading && fdaData && (
          <>
            {(fdaData.openfda?.brand_name || fdaData.openfda?.generic_name) && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Drug
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {fdaData.openfda?.brand_name?.[0]}
                </p>
                {fdaData.openfda?.generic_name?.[0] && (
                  <p className="text-xs text-muted-foreground">
                    Generic: {fdaData.openfda.generic_name[0]}
                  </p>
                )}
              </div>
            )}

            {(fdaData.purpose?.[0] || fdaData.indications_and_usage?.[0]) && (
              <FDARow
                label="Purpose / Use"
                text={fdaData.purpose?.[0] || fdaData.indications_and_usage?.[0]}
              />
            )}

            {fdaData.warnings?.[0] && (
              <FDARow label="Warnings" text={fdaData.warnings[0]} accent="yellow" />
            )}

            {fdaData.boxed_warning?.[0] && (
              <FDARow label="Boxed Warning" text={fdaData.boxed_warning[0]} accent="red" />
            )}

            {fdaData.dosage_and_administration?.[0] && (
              <FDARow
                label="Dosage & Administration"
                text={fdaData.dosage_and_administration[0]}
              />
            )}

            {fdaData.drug_interactions?.[0] && (
              <FDARow
                label="Drug Interactions"
                text={fdaData.drug_interactions[0]}
                accent="orange"
              />
            )}

            {fdaData.openfda?.manufacturer_name?.[0] && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Manufacturer
                </p>
                <p className="text-xs text-foreground">
                  {fdaData.openfda.manufacturer_name[0]}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const medicationName =
    result?.medicationName ||
    result?.name ||
    result?.drug ||
    result?.medications?.[0]?.name ||
    null;

  if (!result) {
    return (
      <div className="px-5 pt-6">
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">No Results Yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Scan a pill bottle or prescription to see medication analysis and interaction warnings.
          </p>
          <Link to="/Capture">
            <Button className="rounded-2xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90">
              <Camera className="w-5 h-5" />
              Start Scanning
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/Capture")}
          className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-xs text-muted-foreground">Review medication interactions</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ResultCard result={result} />
      </motion.div>

      <FDASays medicationName={medicationName} />

      <div className="flex gap-3 mt-6 pb-4">
        <Link to="/Capture" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-2xl gap-2">
            <Camera className="w-4 h-4" />
            Scan Another
          </Button>
        </Link>
        <Link to="/Medications" className="flex-1">
          <Button className="w-full h-12 rounded-2xl gap-2 bg-primary hover:bg-primary/90">
            <Pill className="w-4 h-4" />
            My Medications
          </Button>
        </Link>
      </div>
    </div>
  );
}