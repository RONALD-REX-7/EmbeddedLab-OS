/**
 * EmbeddedLab OS — components/layout/marketing-nav.tsx
 * Precision top navigation header for public pages (Landing, Legal, Documentation).
 */
import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface MarketingNavProps {
  showBackHome?: boolean;
}

export function MarketingNav({ showBackHome = false }: MarketingNavProps) {
  return (
    <header className="border-b border-border-default px-6 py-2.5 flex items-center justify-between bg-surface-panel/90 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-primary rounded"
          aria-label="EmbeddedLab OS Home"
        >
          <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
            <Cpu className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-mono text-xs font-bold tracking-wider">
            <span className="text-foreground">EmbeddedLab</span>
            <span className="text-primary">OS</span>
          </span>
        </Link>

        {showBackHome && (
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground border-l border-border pl-3 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        )}
      </div>

      <nav className="flex items-center gap-3" aria-label="Public Navigation">
        <Link
          href="/labs"
          className="text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider px-1.5 py-1 rounded focus-visible:outline-2 focus-visible:outline-primary"
        >
          Labs
        </Link>
        <Link
          href="/privacy"
          className="hidden md:inline-block text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider px-1.5 py-1 rounded focus-visible:outline-2 focus-visible:outline-primary"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="hidden md:inline-block text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider px-1.5 py-1 rounded focus-visible:outline-2 focus-visible:outline-primary"
        >
          Terms
        </Link>
        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "sm",
            className: "h-7 text-[10px] font-mono font-bold shadow-sm",
          })}
        >
          Launch Workstation
        </Link>
      </nav>
    </header>
  );
}
