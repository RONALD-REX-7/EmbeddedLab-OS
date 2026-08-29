/**
 * EmbeddedLab OS — components/shared/lab-card.tsx
 * Reusable lab summary card used in the lab selection grid and dashboard.
 * No simulation logic — purely presentational.
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

/** Map of icon name strings to Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Activity,
  BarChart2,
  Radio,
};

interface LabCardProps {
  lab: LabDefinition;
  status?: StatusType;
  /** Whether to show the objectives list */
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
        "group relative rounded-lg border border-border bg-card",
        "p-5 transition-colors duration-150",
        isAvailable && "hover:border-primary/40 hover:bg-card/80 cursor-pointer",
        !isAvailable && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center rounded-md",
              "w-9 h-9 shrink-0",
              "bg-primary/10 text-primary",
              "border border-primary/20"
            )}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {lab.shortTitle}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
              {lab.title.split("—")[0]?.trim()}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {lab.description}
      </p>

      {/* Objectives list (optional) */}
      {showObjectives && (
        <ul className="space-y-1 mb-4">
          {lab.objectives.slice(0, 4).map((obj) => (
            <li
              key={obj}
              className="text-xs text-muted-foreground flex items-start gap-2"
            >
              <span
                className="mt-1 h-1 w-1 rounded-full bg-primary/50 shrink-0"
                aria-hidden="true"
              />
              {obj}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {lab.challengeCount} challenge{lab.challengeCount !== 1 ? "s" : ""}
        </span>
        {isAvailable && (
          <ChevronRight
            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
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
