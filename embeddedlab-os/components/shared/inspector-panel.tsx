/**
 * EmbeddedLab OS — components/shared/inspector-panel.tsx
 * Property & Configuration Inspector Component.
 * Standard right-hand column in lab workspaces.
 */
import { Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspectorRowProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  code?: boolean;
}

export function InspectorRow({ label, value, unit, code = true }: InspectorRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
      <span className="text-muted-foreground font-sans">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn(code ? "font-mono font-medium text-foreground" : "font-sans text-foreground")}>
          {value}
        </span>
        {unit && <span className="font-mono text-[11px] text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

interface InspectorPanelProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function InspectorPanel({
  title = "Inspector",
  subtitle = "Configuration & State",
  children,
  className,
}: InspectorPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-4 flex flex-col",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <Sliders className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-1 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
