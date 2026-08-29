/**
 * EmbeddedLab OS — components/shared/lab-placeholder.tsx
 * Reusable placeholder layout for lab pages prior to simulator UI implementation.
 * Uses the Phase 2 design system components (Panel, InspectorPanel, MetricCard, EventLogView).
 */
import Link from "next/link";
import { ArrowLeft, Cpu, FlaskConical, Info, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Panel } from "@/components/shared/panel";
import { InspectorPanel, InspectorRow } from "@/components/shared/inspector-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { EventLogView } from "@/components/shared/event-log-view";
import { getLabById } from "@/lib/constants/labs";
import type { LabId, SimulationEvent } from "@/types/simulator";

interface LabPlaceholderProps {
  labId: LabId;
}

const STATIC_NOW = 1740000000000;

export function LabPlaceholder({ labId }: LabPlaceholderProps) {
  const lab = getLabById(labId);

  if (!lab) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Lab not found.</p>
      </div>
    );
  }

  // Pure demonstration event log entries for Phase 2 UI verification
  const demoEvents: SimulationEvent[] = [
    {
      id: "evt_1",
      timestamp: STATIC_NOW - 35000,
      severity: "INFO",
      labId,
      type: "system_init",
      message: `Virtual MCU ${lab.shortTitle} peripheral engine initialized.`,
    },
    {
      id: "evt_2",
      timestamp: STATIC_NOW - 15000,
      severity: "SUCCESS",
      labId,
      type: "boundary_ready",
      message: `Module boundary \`lib/simulator/${lab.id}.ts\` registered in store context.`,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FlaskConical className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Laboratory Workspace
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{lab.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {lab.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="not-started" />
          <Link
            href="/labs"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            All Labs
          </Link>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="rounded-lg border border-[var(--feedback-info)]/30 bg-[var(--feedback-info)]/10 p-4 flex items-start gap-3 text-sm">
        <Info className="h-5 w-5 text-[var(--feedback-info)] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="font-semibold text-foreground">
            Phase 2 Design System Preview
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The engineering workspace layout below demonstrates the Phase 2 component system (Panels, Inspector, Metrics, Event Log). Interactive simulator state controls will be wired in Phase 3–6.
          </p>
        </div>
      </div>

      {/* Engineering Workspace Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content Area (2 cols on large screens) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Visualizer Panel */}
          <Panel
            title={`${lab.shortTitle} Peripheral Visualizer`}
            subtitle="Virtual hardware simulation workspace"
            icon={Wrench}
            variant="sunken"
          >
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cpu className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Interactive {lab.shortTitle} Simulator Container
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mt-1">
                  This workspace container will house the visual pin grid, waveforms, voltage gauges, or UART terminals when activated.
                </p>
              </div>
            </div>

            {/* Metrics preview row */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/80">
              <MetricCard label="Engine Status" value="READY" signalState="high" />
              <MetricCard label="Module" value={lab.id.toUpperCase()} signalState="normal" />
              <MetricCard label="Challenges" value={lab.challengeCount} unit="items" signalState="normal" />
            </div>
          </Panel>

          {/* Event Log Component */}
          <EventLogView events={demoEvents} maxHeight="h-44" />
        </div>

        {/* Right Column: Inspector Panel */}
        <div className="space-y-5">
          <InspectorPanel
            title={`${lab.shortTitle} Inspector`}
            subtitle="Engine configuration parameters"
          >
            <InspectorRow label="Target Peripheral" value={lab.shortTitle} />
            <InspectorRow label="Simulation Engine" value={`lib/simulator/${lab.id}.ts`} />
            <InspectorRow label="Type System" value="types/simulator.ts" />
            <InspectorRow label="State Container" value="Zustand Store" />
            <InspectorRow label="Validation Logic" value="Deterministic" />

            <div className="pt-4 border-t border-border/60 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Planned Objectives
              </span>
              <ul className="space-y-1.5">
                {lab.objectives.map((obj, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="font-mono text-primary text-[10px] shrink-0 mt-0.5">
                      0{i + 1}.
                    </span>
                    <span className="leading-snug">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </InspectorPanel>
        </div>
      </div>
    </div>
  );
}
