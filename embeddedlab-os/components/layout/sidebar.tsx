/**
 * EmbeddedLab OS — components/layout/sidebar.tsx
 * Application sidebar navigation.
 * Server component — reads pathname via "use client" link wrapper.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart2,
  FlaskConical,
  LayoutDashboard,
  Radio,
  Settings,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Nav structure ──────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Whether this is a child item (indented) */
  isChild?: boolean;
}

const TOP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Labs", href: "/labs", icon: FlaskConical },
];

const LAB_NAV: NavItem[] = [
  { label: "GPIO", href: "/labs/gpio", icon: Zap, isChild: true },
  { label: "PWM", href: "/labs/pwm", icon: Activity, isChild: true },
  { label: "ADC", href: "/labs/adc", icon: BarChart2, isChild: true },
  { label: "UART", href: "/labs/uart", icon: Radio, isChild: true },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

/* ─── NavLink component ──────────────────────────── */

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    item.href === "/labs"
      ? pathname === "/labs"
      : pathname === item.href || pathname.startsWith(item.href + "/");

  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-md text-sm font-medium",
            "px-3 py-2 transition-colors duration-100",
            "relative group",
            item.isChild ? "pl-8" : "pl-3",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          {/* Active indicator */}
          {isActive && (
            <span
              className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary"
              aria-hidden="true"
            />
          )}

          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
            strokeWidth={1.75}
            aria-hidden="true"
          />

          <span className="truncate">{item.label}</span>

          {isActive && item.isChild && (
            <ChevronRight
              className="ml-auto h-3 w-3 text-primary/60"
              aria-hidden="true"
            />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="hidden">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

/* ─── NavSection ─────────────────────────────────── */

function NavSection({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      {label && (
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col w-56 shrink-0 h-full",
        "bg-sidebar border-r border-sidebar-border",
        "py-4"
      )}
      aria-label="Application navigation"
    >
      {/* Logo */}
      <div className="px-4 pb-4 border-b border-sidebar-border mb-4">
        <Logo size="md" />
        <p className="mt-1.5 text-[10px] text-muted-foreground/60 font-mono leading-tight">
          Virtual Embedded Lab
        </p>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto" aria-label="Main">
        <NavSection>
          {TOP_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </NavSection>

        <NavSection label="Labs">
          {LAB_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </NavSection>
      </nav>

      {/* Bottom navigation */}
      <div className="px-3 pt-4 mt-auto border-t border-sidebar-border space-y-0.5">
        {BOTTOM_NAV.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      {/* Environment notice */}
      <div className="px-4 pt-3 mt-3 border-t border-sidebar-border">
        <div className="rounded px-2 py-1.5 bg-muted/30">
          <p className="text-[10px] font-mono text-muted-foreground leading-snug">
            <span className="text-[var(--feedback-info)] font-medium">DEMO</span>
            {" "}· No account required
          </p>
        </div>
      </div>
    </aside>
  );
}
