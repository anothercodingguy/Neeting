"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ListChecks, Gavel, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/services/api";

interface SummaryPanelProps {
  meetingId: number;
}

export default function SummaryPanel({ meetingId }: SummaryPanelProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [actions, setActions] = useState<string[] | null>(null);
  const [decisions, setDecisions] = useState<string[] | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingActions, setLoadingActions] = useState(false);
  const [loadingDecisions, setLoadingDecisions] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.post(`/meetings/${meetingId}/generate-summary`);
      setSummary(res.data.summary);
      setOpenSection("summary");
    } catch { /* handled */ }
    setLoadingSummary(false);
  };

  const generateActions = async () => {
    setLoadingActions(true);
    try {
      const res = await api.post(`/meetings/${meetingId}/generate-actions`);
      setActions(res.data.action_items);
      setOpenSection("actions");
    } catch { /* handled */ }
    setLoadingActions(false);
  };

  const generateDecisions = async () => {
    setLoadingDecisions(true);
    try {
      const res = await api.post(`/meetings/${meetingId}/generate-decisions`);
      setDecisions(res.data.decisions);
      setOpenSection("decisions");
    } catch { /* handled */ }
    setLoadingDecisions(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-zinc-400" />
        AI Insights
      </h2>

      {/* Summary */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
          onClick={() => (summary ? toggleSection("summary") : generateSummary())}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Summary
          </div>
          {summary ? (
            openSection === "summary" ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />
          ) : (
            <Button size="sm" variant="secondary" onClick={generateSummary} disabled={loadingSummary}>
              {loadingSummary ? <Loader2 className="h-3 w-3 animate-spin" /> : "Generate"}
            </Button>
          )}
        </div>
        {openSection === "summary" && summary && (
          <div className="px-4 pb-4 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800 pt-3">
            {summary}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
          onClick={() => (actions ? toggleSection("actions") : generateActions())}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <ListChecks className="h-4 w-4 text-emerald-500" />
            Action Items
          </div>
          {actions ? (
            openSection === "actions" ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />
          ) : (
            <Button size="sm" variant="secondary" onClick={generateActions} disabled={loadingActions}>
              {loadingActions ? <Loader2 className="h-3 w-3 animate-spin" /> : "Generate"}
            </Button>
          )}
        </div>
        {openSection === "actions" && actions && (
          <ul className="px-4 pb-4 space-y-1.5 border-t border-zinc-800 pt-3">
            {actions.map((item, i) => (
              <li key={i} className="text-sm text-zinc-300 flex gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Decisions */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
          onClick={() => (decisions ? toggleSection("decisions") : generateDecisions())}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Gavel className="h-4 w-4 text-zinc-400" />
            Decisions
          </div>
          {decisions ? (
            openSection === "decisions" ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />
          ) : (
            <Button size="sm" variant="secondary" onClick={generateDecisions} disabled={loadingDecisions}>
              {loadingDecisions ? <Loader2 className="h-3 w-3 animate-spin" /> : "Generate"}
            </Button>
          )}
        </div>
        {openSection === "decisions" && decisions && (
          <ul className="px-4 pb-4 space-y-1.5 border-t border-zinc-800 pt-3">
            {decisions.map((item, i) => (
              <li key={i} className="text-sm text-zinc-300 flex gap-2">
                <span className="text-zinc-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
