/**
 * EmbeddedLab OS — components/layout/topbar.tsx
 * Precision laboratory workstation top bar with live status indicators.
 */
"use client";

import Link from "next/link";
import { LogIn, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";
import { cn } from "@/lib/utils";

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const { user, isDemoMode, signOut } = useAuth();

  return (
    <header
      className={cn(
        "h-11 shrink-0 flex items-center justify-between",
        "px-4 border-b border-border-default bg-surface-panel/90 backdrop-blur-md relative z-10",
        className
      )}
      role="banner"
    >
      {/* Left: Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Right: Instrumentation telemetry & authentication controls */}
      <div className="flex items-center gap-3 font-mono text-xs select-none">
        {/* Hardware Clock / Deterministic Simulator Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-sunken border border-border-subtle text-muted-foreground text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-high animate-pulse" />
          <span>VIRTUAL STM32 ARCH</span>
          <span className="text-border">|</span>
          <span className="text-primary font-bold">STATE SYNC</span>
        </div>

        {/* Demo Mode / Cloud Sync Indicator */}
        {isDemoMode ? (
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold tracking-wider uppercase flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            LOCAL DEMO MODE
          </span>
        ) : (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold tracking-wider uppercase flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            CLOUD SYNC ACTIVE
          </span>
        )}

        {/* User Account / Auth Controls */}
        {user ? (
          <div className="flex items-center gap-2 border-l border-border pl-2.5">
            <div className="hidden sm:flex items-center gap-1.5 text-foreground text-[11px]">
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span className="truncate max-w-32.5 font-semibold">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={signOut}
              className="h-6 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40"
            >
              <LogOut className="h-3 w-3 mr-1 text-muted-foreground" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button size="xs" className="h-6 text-[10px] font-mono font-semibold px-2.5">
              <LogIn className="h-3 w-3 mr-1" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
