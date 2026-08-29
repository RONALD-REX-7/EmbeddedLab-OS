/**
 * EmbeddedLab OS — components/layout/topbar.tsx
 * Application top bar. Shows breadcrumb, authentication state, and demo mode indicator.
 */
"use client";

import Link from "next/link";
import { Cpu, LogIn, LogOut, User as UserIcon } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatusBadge } from "@/components/shared/status-badge";
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
        "h-12 shrink-0 flex items-center justify-between",
        "px-5 border-b border-border bg-background/95",
        className
      )}
      role="banner"
    >
      {/* Left: breadcrumb */}
      <Breadcrumb />

      {/* Right: user status & auth controls */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Virtual MCU Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
          <Cpu className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <span>Virtual MCU</span>
        </div>

        {/* Demo Mode / Configured Badge */}
        {isDemoMode ? (
          <StatusBadge status="demo" />
        ) : (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
            SUPABASE ACTIVE
          </span>
        )}

        {/* User Account / Auth Controls */}
        {user ? (
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="hidden sm:flex items-center gap-1.5 text-foreground">
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span className="truncate max-w-[140px]">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button size="sm" className="h-7 text-xs font-mono">
              <LogIn className="h-3.5 w-3.5 mr-1" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
