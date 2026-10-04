"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "pill" | "icon";
}

// React 19 recommended hydration detection pattern (zero cascading renders)
function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle({ className, variant = "pill" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-border/60 bg-surface-subtle text-muted-foreground transition-colors",
          variant === "pill" ? "h-7 px-2.5 text-[10px] gap-1.5 font-mono" : "h-7 w-7",
          className
        )}
        aria-hidden="true"
      >
        <span className="h-3 w-3 rounded-full bg-muted-foreground/30 animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "h-7 w-7 rounded-full border border-border/80 bg-surface-panel/90 text-foreground",
          "hover:border-primary/50 hover:bg-surface-elevated hover:text-primary transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "inline-flex items-center justify-center shadow-2xs cursor-pointer",
          className
        )}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Current: ${isDark ? "Dark" : "Light"} mode. Click to toggle.`}
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-full border border-border/80 bg-surface-subtle shadow-2xs font-mono text-[10px]",
        className
      )}
      role="radiogroup"
      aria-label="Theme selection"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all duration-150 cursor-pointer font-medium",
          !isDark
            ? "bg-surface-panel text-foreground shadow-2xs border border-border/60 font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className={cn("h-3 w-3", !isDark ? "text-amber-500" : "text-muted-foreground")} />
        <span>Light</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all duration-150 cursor-pointer font-medium",
          isDark
            ? "bg-surface-elevated text-foreground shadow-2xs border border-border/60 font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className={cn("h-3 w-3", isDark ? "text-primary" : "text-muted-foreground")} />
        <span>Dark</span>
      </button>
    </div>
  );
}
