/**
 * EmbeddedLab OS — components/layout/sidebar.tsx
 * Precision engineering workstation sidebar navigation.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart2,
  Cpu,
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

interface NavItem {
  label: string;
  sublabel?: string;
  href: string;
  icon: React.ElementType;
  isChild?: boolean;
  tag?: string;
}

const TOP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Lab Directory", href: "/labs", icon: FlaskConical },
];

const LAB_NAV: NavItem[] = [
  { label: "GPIO", sublabel: "Digital I/O & LEDs", href: "/labs/gpio", icon: Zap, isChild: true, tag: "16-PIN" },
  { label: "PWM", sublabel: "Waveform Generator", href: "/labs/pwm", icon: Activity, isChild: true, tag: "4-CH" },
  { label: "ADC", sublabel: "Analog Quantization", href: "/labs/adc", icon: BarChart2, isChild: true, tag: "12-BIT" },
  { label: "UART", sublabel: "Serial Transceiver", href: "/labs/uart", icon: Radio, isChild: true, tag: "ASYNC" },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    item.href === "/labs"
      ? pathname === "/labs"
      : pathname === item.href || pathname.startsWith(item.href + "/");

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded text-xs font-mono font-medium",
        "px-2.5 py-1.5 transition-all duration-150 relative group select-none",
        item.isChild ? "pl-5" : "pl-2.5",
        isActive
          ? "bg-primary/10 text-primary border border-primary/25 shadow-sm font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60 border border-transparent"
      )}
    >
      {/* Active Left Indicator Notch */}
      {isActive && (
        <span
          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary shadow-[0_0_6px_rgba(56,189,248,0.6)]"
          aria-hidden="true"
        />
      )}

      <Icon
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}
        strokeWidth={isActive ? 2 : 1.75}
        aria-hidden="true"
      />

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate">{item.label}</span>
          {item.tag && (
            <span
              className={cn(
                "text-[8px] font-mono font-bold px-1 py-0.2 rounded shrink-0",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted/40 text-muted-foreground/80 border border-border/40"
              )}
            >
              {item.tag}
            </span>
          )}
        </div>
      </div>

      {isActive && item.isChild && (
        <ChevronRight className="h-3 w-3 text-primary/70 shrink-0" aria-hidden="true" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col w-56 shrink-0 h-full",
        "bg-sidebar border-r border-sidebar-border",
        "py-3.5 relative z-20"
      )}
      aria-label="Application navigation"
    >
      {/* Brand Header */}
      <div className="px-3.5 pb-3 border-b border-sidebar-border mb-3">
        <Logo size="md" />
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-high shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider font-semibold">
            ENGINEERING WORKSTATION
          </span>
        </div>
      </div>

      {/* Main Navigation Tree */}
      <nav className="flex-1 px-2.5 space-y-4 overflow-y-auto" aria-label="Main">
        <div className="space-y-0.5">
          {TOP_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <div className="space-y-0.5 pt-2 border-t border-sidebar-border/50">
          <div className="px-2 mb-1 flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60 select-none">
            <span>PERIPHERAL LABS</span>
            <span className="text-[8px] bg-muted/40 px-1 py-0.2 rounded">4 / 4</span>
          </div>
          {LAB_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* System Status & Telemetry Module */}
      <div className="px-3 pt-2.5 mt-auto border-t border-sidebar-border space-y-2">
        <div className="space-y-0.5">
          {BOTTOM_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Telemetry Indicator Card */}
        <div className="rounded border border-border-subtle bg-surface-sunken p-2 space-y-1 font-mono text-[10px] select-none">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-primary" />
              SIMULATOR CORE
            </span>
            <span className="text-signal-high font-bold">16 MHz</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground/70 text-[9px]">
            <span>ENGINE: DETERMINISTIC</span>
            <span className="text-primary font-bold">ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
