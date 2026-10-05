/**
 * EmbeddedLab OS — components/shared/ai-assistant-panel.tsx
 * Scoped, professional AI Contextual Engineering Assistant.
 * Provides exact 3 actions (Explain, Hint, Debug) with clean technical formatting.
 */
"use client";

import { useState } from "react";
import { AlertTriangle, Bug, HelpCircle, Lightbulb, Loader2, Sparkles, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { requestAIGuidance } from "@/lib/ai/service";
import type { AIActionType, AIResponsePayload } from "@/lib/ai/fallback";
import type { LabId, MicrocontrollerState } from "@/types/simulator";
import { cn } from "@/lib/utils";

interface AIAssistantPanelProps {
  labId: LabId;
  state: MicrocontrollerState;
  activeChallengeId?: string | null;
  className?: string;
}

export function AIAssistantPanel({
  labId,
  state,
  activeChallengeId,
  className,
}: AIAssistantPanelProps) {
  const [activeResponse, setActiveResponse] = useState<AIResponsePayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<AIActionType | null>(null);

  const handleAction = async (action: AIActionType) => {
    setIsLoading(true);
    setActiveAction(action);

    const response = await requestAIGuidance({
      action,
      labId,
      state,
      challengeId: activeChallengeId,
    });

    setActiveResponse(response);
    setIsLoading(false);
    setActiveAction(null);
  };

  return (
    <Panel
      title="AI Contextual Assistant"
      icon={Terminal}
      telemetryTag="GEMINI 2.5"
      className={cn("space-y-3", className)}
    >
      {/* Educational Notice */}
      <div className="rounded border border-amber-600/25 dark:border-amber-500/25 bg-amber-500/5 p-2 flex items-start gap-2 text-[10px] font-mono text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
        <span className="leading-tight text-foreground/80 dark:text-muted-foreground">
          <strong className="text-amber-800 dark:text-amber-300 font-bold">Educational Guidance:</strong> Suggestions assist conceptual learning. State validation is evaluated by the deterministic simulation kernel.
        </span>
      </div>

      {/* Exactly 3 Contextual Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        <Button
          variant="outline"
          size="xs"
          disabled={isLoading}
          onClick={() => handleAction("explain")}
          className={cn(
            "font-mono text-[10px] justify-center h-7 border-border hover:border-primary/50 control-elevated",
            activeAction === "explain" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "explain" ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            <Lightbulb className="mr-1 h-3 w-3 text-amber-400" aria-hidden="true" />
          )}
          Explain
        </Button>

        <Button
          variant="outline"
          size="xs"
          disabled={isLoading}
          onClick={() => handleAction("hint")}
          className={cn(
            "font-mono text-[10px] justify-center h-7 border-border hover:border-primary/50 control-elevated",
            activeAction === "hint" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "hint" ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            <HelpCircle className="mr-1 h-3 w-3 text-sky-400" aria-hidden="true" />
          )}
          Hint
        </Button>

        <Button
          variant="outline"
          size="xs"
          disabled={isLoading}
          onClick={() => handleAction("debug")}
          className={cn(
            "font-mono text-[10px] justify-center h-7 border-border hover:border-primary/50 control-elevated",
            activeAction === "debug" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "debug" ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            <Bug className="mr-1 h-3 w-3 text-emerald-400" aria-hidden="true" />
          )}
          Debug State
        </Button>
      </div>

      {/* Response Display Box */}
      {activeResponse && (
        <div
          className={cn(
            "rounded border p-3 space-y-2 font-mono text-xs shadow-inner",
            activeResponse.isError
              ? "border-amber-500/40 bg-amber-500/5 text-amber-200"
              : "border-[var(--border-default)] bg-[var(--surface-sunken)]"
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1 uppercase font-bold text-foreground">
              {activeResponse.isError ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-amber-400" aria-hidden="true" />
                  Service Notice
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                  {activeResponse.action} Analysis
                </>
              )}
            </span>
            {activeResponse.isError ? (
              <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/30">
                Notice
              </span>
            ) : activeResponse.isFallback ? (
              <span className="text-[9px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                Local Fallback
              </span>
            ) : (
              <span className="text-[9px] bg-primary/20 px-1.5 py-0.5 rounded text-primary border border-primary/30">
                Gemini 2.5 Live
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[11px] leading-relaxed text-foreground font-sans pt-0.5">
            {activeResponse.content.split("\n").map((line, idx) => {
              if (line.startsWith("### ")) {
                return (
                  <h4 key={idx} className="font-bold text-xs text-foreground pt-1 font-mono text-primary">
                    {line.replace("### ", "")}
                  </h4>
                );
              }
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <div key={idx} className="flex items-start gap-1.5 pl-1">
                    <span className="text-primary font-mono font-bold">›</span>
                    <span>{line.replace(/^[*\-]\s*/, "")}</span>
                  </div>
                );
              }
              return line.trim() ? <p key={idx}>{line}</p> : null;
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}
