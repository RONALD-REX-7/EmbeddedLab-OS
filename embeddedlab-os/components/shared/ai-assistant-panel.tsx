/**
 * EmbeddedLab OS — components/shared/ai-assistant-panel.tsx
 *
 * Contextual AI Learning Assistant UI.
 * Provides exactly three action buttons: Explain Concept, Progressive Hint, and Debug Hardware State.
 * Displays clear disclaimer labeling AI outputs as educational guidance.
 */
"use client";

import { useState } from "react";
import { AlertTriangle, Bot, Bug, HelpCircle, Lightbulb, Loader2, Sparkles } from "lucide-react";

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
      icon={Bot}
      className={cn("space-y-4", className)}
    >
      {/* Disclaimer Banner */}
      <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-start gap-2.5 text-[11px] font-mono text-amber-400">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="block font-bold">AI Educational Guidance</strong>
          <span className="text-[10px] text-muted-foreground">
            AI suggestions provide learning support. Official verification is calculated deterministically by the simulator engine.
          </span>
        </div>
      </div>

      {/* Exactly 3 Contextual Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleAction("explain")}
          className={cn(
            "font-mono text-xs justify-start h-9 border-border hover:border-primary/50",
            activeAction === "explain" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "explain" ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
          )}
          Explain Concept
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleAction("hint")}
          className={cn(
            "font-mono text-xs justify-start h-9 border-border hover:border-primary/50",
            activeAction === "hint" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "hint" ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
          )}
          Progressive Hint
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleAction("debug")}
          className={cn(
            "font-mono text-xs justify-start h-9 border-border hover:border-primary/50",
            activeAction === "debug" && "border-primary text-primary"
          )}
        >
          {isLoading && activeAction === "debug" ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Bug className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
          )}
          Debug State
        </Button>
      </div>

      {/* Response Display Box */}
      {activeResponse && (
        <div className="rounded-md border border-border bg-card p-4 space-y-2 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between border-b border-border pb-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {activeResponse.action} Response
            </span>
            {activeResponse.isFallback && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                Offline Mode
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-foreground font-sans pt-1">
            {activeResponse.content.split("\n").map((line, idx) => {
              if (line.startsWith("### ")) {
                return (
                  <h4 key={idx} className="font-bold text-sm text-foreground pt-1 font-mono">
                    {line.replace("### ", "")}
                  </h4>
                );
              }
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <div key={idx} className="flex items-start gap-1.5 pl-1">
                    <span className="text-primary font-bold">•</span>
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
