/**
 * EmbeddedLab OS — components/layout/app-navbar.tsx
 * Precision Top Instrument Ribbon for the engineering workstation.
 * Combines laboratory selection, telemetry badges, theme controls, and user status.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart2,
  Cpu,
  FlaskConical,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Radio,
  Settings,
  ShieldCheck,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";
import { cn } from "@/lib/utils";

interface LabTab {
  id: string;
  label: string;
  href: string;
  tag: string;
  icon: React.ElementType;
}

const LAB_TABS: LabTab[] = [
  { id: "gpio", label: "GPIO", href: "/labs/gpio", tag: "16-PIN", icon: Zap },
  { id: "pwm", label: "PWM", href: "/labs/pwm", tag: "4-CH", icon: Activity },
  { id: "adc", label: "ADC", href: "/labs/adc", tag: "12-BIT", icon: BarChart2 },
  { id: "uart", label: "UART", href: "/labs/uart", tag: "ASYNC", icon: Radio },
];

const UTILITY_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Labs", href: "/labs", icon: FlaskConical },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppNavbar() {
  const pathname = usePathname();
  const { user, isDemoMode, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Synchronize mobile menu closure during render when route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <header
      className="h-12 shrink-0 border-b border-border/80 bg-surface-panel/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 flex items-center justify-between transition-colors shadow-2xs"
      role="banner"
    >
      {/* Left: Brand Identity & Lab Selector */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Brand Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 focus-visible:outline-2 focus-visible:outline-primary rounded-md p-1 -m-1"
          aria-label="EmbeddedLab OS Home"
        >
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/15 transition-all shadow-2xs">
            <Cpu className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} aria-hidden="true" />
          </div>
          <span className="font-mono text-xs font-bold tracking-tight hidden sm:inline-block">
            <span className="text-foreground">EmbeddedLab</span>
            <span className="text-primary font-black">OS</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-border/80 shrink-0" aria-hidden="true" />

        {/* Desktop 4-Lab Quick Switcher Ribbon */}
        <nav
          className="hidden md:flex items-center gap-1 p-0.5 rounded-lg bg-surface-subtle border border-border/60"
          aria-label="Laboratory Workbenches"
        >
          {LAB_TABS.map((lab) => {
            const isActive = pathname === lab.href || pathname.startsWith(lab.href + "/");
            const Icon = lab.icon;
            return (
              <Link
                key={lab.id}
                href={lab.href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-surface-panel text-primary font-semibold shadow-2xs border border-border/70"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-3 w-3 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.75}
                  aria-hidden="true"
                />
                <span>{lab.label}</span>
                <span
                  className={cn(
                    "text-[8px] font-mono px-1 py-0.2 rounded font-bold uppercase",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-sunken text-muted-foreground/80"
                  )}
                >
                  {lab.tag}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Breadcrumb Trail on smaller/tablet screens */}
        <div className="hidden lg:block">
          <Breadcrumb className="text-xs font-mono" />
        </div>
      </div>

      {/* Right: Telemetry, Navigation Links, Theme Toggle, Auth */}
      <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs select-none">
        {/* Core Hardware Clock Telemetry Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border/70 text-muted-foreground text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-high animate-pulse" aria-hidden="true" />
          <span>VIRTUAL STM32</span>
          <span className="text-border">|</span>
          <span className="text-primary font-bold">16 MHz</span>
        </div>

        {/* Demo Mode / Cloud Sync Indicator */}
        {isDemoMode ? (
          <span className="hidden sm:inline-flex text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span>DEMO MODE</span>
          </span>
        ) : (
          <span className="hidden sm:inline-flex text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            <span>CLOUD SYNC</span>
          </span>
        )}

        {/* Desktop Quick Nav: Dashboard & Progress */}
        <div className="hidden lg:flex items-center gap-1 border-l border-border/80 pl-2.5">
          <Link
            href="/dashboard"
            className={cn(
              "px-2 py-1 rounded text-[11px] font-mono transition-colors",
              pathname === "/dashboard"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/progress"
            className={cn(
              "px-2 py-1 rounded text-[11px] font-mono transition-colors",
              pathname === "/progress"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
            )}
          >
            Progress
          </Link>
          <Link
            href="/settings"
            className={cn(
              "p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50 transition-colors",
              pathname === "/settings" && "text-primary"
            )}
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle variant="icon" />

        {/* Auth / Account Controls */}
        {user ? (
          <div className="flex items-center gap-2 border-l border-border/80 pl-2">
            <div className="hidden md:flex items-center gap-1.5 text-foreground text-[11px]">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-[10px]">
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
              <span className="truncate max-w-28 font-medium">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={signOut}
              className="h-7 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              aria-label="Sign out of EmbeddedLab OS"
            >
              <LogOut className="h-3 w-3 mr-1 text-muted-foreground" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Link href="/login" className="border-l border-border/80 pl-2">
            <Button size="xs" className="h-7 text-[10px] font-mono font-semibold px-2.5 shadow-2xs">
              <LogIn className="h-3 w-3 mr-1" aria-hidden="true" />
              Sign In
            </Button>
          </Link>
        )}

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-md border border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-12 left-0 right-0 border-b border-border bg-surface-panel/98 backdrop-blur-xl p-4 shadow-lg z-50 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Lab Selector Section */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70 block mb-2">
              Virtual Laboratories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {LAB_TABS.map((lab) => {
                const isActive = pathname === lab.href || pathname.startsWith(lab.href + "/");
                const Icon = lab.icon;
                return (
                  <Link
                    key={lab.id}
                    href={lab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border text-xs font-mono font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "bg-surface-subtle border-border/70 text-foreground hover:border-primary/40"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{lab.label}</span>
                      <span className="text-[9px] text-muted-foreground">{lab.tag}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="border-t border-border/60 pt-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
              Workbench Pages
            </span>
            <div className="flex flex-col gap-1">
              {UTILITY_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors",
                      isActive
                        ? "bg-surface-elevated text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Telemetry & Legal */}
          <div className="border-t border-border/60 pt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Deterministic 16 MHz Simulator</span>
            <div className="flex items-center gap-2">
              <Link href="/privacy" className="hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Terms
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
