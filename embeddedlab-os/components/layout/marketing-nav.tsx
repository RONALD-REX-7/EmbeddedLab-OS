/**
 * EmbeddedLab OS — components/layout/marketing-nav.tsx
 * Precision top navigation header for public pages (Landing, Legal, Documentation).
 */
import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface MarketingNavProps {
  showBackHome?: boolean;
}

export function MarketingNav({ showBackHome = false }: MarketingNavProps) {
  return (
    <header className="border-b border-border/80 px-4 sm:px-8 py-2.5 flex items-center justify-between bg-surface-panel/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-primary rounded-md p-1 -m-1"
          aria-label="EmbeddedLab OS Home"
        >
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/15 transition-all shadow-2xs">
            <Cpu className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold tracking-tight">
            <span className="text-foreground">EmbeddedLab</span>
            <span className="text-primary font-black">OS</span>
            <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-surface-subtle text-muted-foreground border border-border/60 ml-1">
              v1.0
            </span>
          </div>
        </Link>

        {showBackHome && (
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground border-l border-border pl-3 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Home</span>
          </Link>
        )}
      </div>

      <nav className="flex items-center gap-2 sm:gap-3" aria-label="Public Navigation">
        <Link
          href="/labs"
          className="text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-surface-elevated/60"
        >
          Labs
        </Link>
        <Link
          href="/dashboard"
          className="hidden sm:inline-block text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-surface-elevated/60"
        >
          Workstation
        </Link>

        <div className="h-4 w-px bg-border/80 mx-0.5" aria-hidden="true" />

        <ThemeToggle variant="icon" />

        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "sm",
            className: "h-7 text-[10px] font-mono font-semibold px-3 shadow-xs",
          })}
        >
          Launch Lab
        </Link>
      </nav>
    </header>
  );
}
