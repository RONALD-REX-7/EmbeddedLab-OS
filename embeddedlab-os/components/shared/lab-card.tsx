/**
 * EmbeddedLab OS — components/shared/lab-card.tsx
 * Lab selection card with engineering-grade layout.
 */
import Link from "next/link";
import {
  Activity,
  BarChart2,
  Radio,
  Zap,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, type StatusType } from "@/components/shared/status-badge";
import type { LabDefinition } from "@/lib/constants/labs";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Activity,
  BarChart2,
  Radio,
};

interface LabCardProps {
  lab: LabDefinition;
  status?: StatusType;
  showObjectives?: boolean;
  className?: string;
}

export function LabCard({
  lab,
  status = "active",
  showObjectives = false,
  className,
}: LabCardProps) {
  const Icon = ICON_MAP[lab.icon] ?? Zap;
  const isAvailable = status !== "coming-soon";

  const card = (
    <div
      className={cn(
        "group relative rounded border border-[var(--border-default)] bg-[var(--surface-panel)]",
        "p-4 transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.15)]",
        isAvailable && "hover:border-primary/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)] cursor-pointer",
        !isAvailable && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex items-center justify-center rounded",
              "w-8 h-8 shrink-0",
              "bg-primary/10 text-primary",
              "border border-primary/20"
            )}
            aria-hidden="true"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground leading-tight">
              {lab.shortTitle}
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              {lab.title.split("—")[0]?.trim()}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground font-sans leading-relaxed mb-2.5">
        {lab.description}
      </p>

      {/* Objectives */}
      {showObjectives && (
        <ul className="space-y-0.5 mb-3">
          {lab.objectives.slice(0, 4).map((obj) => (
            <li
              key={obj}
              className="text-[10px] text-muted-foreground flex items-start gap-1.5 font-mono"
            >
              <span
                className="mt-1 h-1 w-1 rounded-full bg-primary/60 shrink-0"
                aria-hidden="true"
              />
              {obj}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <span className="text-[9px] text-muted-foreground font-mono font-bold uppercase tracking-wider">
          {lab.challengeCount} challenge{lab.challengeCount !== 1 ? "s" : ""}
        </span>
        {isAvailable && (
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );

  if (!isAvailable) return card;

  return (
    <Link href={lab.route} aria-label={`Open ${lab.shortTitle} lab`}>
      {card}
    </Link>
  );
}
