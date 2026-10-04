/**
 * EmbeddedLab OS — components/layout/breadcrumb.tsx
 * Renders a breadcrumb trail from the current pathname.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Map of path segments to human-readable labels */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  labs:      "Labs",
  gpio:      "GPIO",
  pwm:       "PWM",
  adc:       "ADC",
  uart:      "UART",
  progress:  "Progress",
  settings:  "Settings",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

function parseBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: SEGMENT_LABELS[segment] ?? segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const crumbs = parseBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm", className)}
    >
      {crumbs.map((crumb) =>
        crumb.isLast ? (
          <span
            key={crumb.href}
            aria-current="page"
            className="font-medium text-foreground"
          >
            {crumb.label}
          </span>
        ) : (
          <span key={crumb.href} className="flex items-center gap-1">
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5"
            >
              {crumb.label}
            </Link>
            <ChevronRight
              className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"
              aria-hidden="true"
            />
          </span>
        )
      )}
    </nav>
  );
}
