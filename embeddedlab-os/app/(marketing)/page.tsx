/**
 * EmbeddedLab OS — app/(marketing)/page.tsx
 * Landing Page — Engineering-grade product showcase.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Radio,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LABS } from "@/lib/constants/labs";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "EmbeddedLab OS — Interactive Virtual Embedded Systems Laboratory",
  description:
    "Learn GPIO, PWM, ADC, and UART through interactive virtual experiments. No hardware required.",
};

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Activity,
  BarChart2,
  Radio,
};

const VALUE_PROPS = [
  {
    icon: FlaskConical,
    title: "Virtual Laboratory",
    description:
      "Experiment with GPIO, PWM, ADC, and UART peripherals in a deterministic software simulation.",
  },
  {
    icon: Cpu,
    title: "No Hardware Required",
    description:
      "Everything runs in the browser. No development board, no cables, no drivers.",
  },
  {
    icon: CheckCircle2,
    title: "Guided Challenges",
    description:
      "Each lab includes structured challenges with progressive hints and automatic validation.",
  },
  {
    icon: Activity,
    title: "Real Calculations",
    description:
      "ADC conversions, PWM timing, and UART frame analysis use actual engineering formulas.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-primary focus:text-primary-foreground focus:rounded focus:font-mono focus:text-xs focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* ── Navigation Bar ── */}
      <MarketingNav />

      {/* ── Main Landmark ── */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* ── Hero Section ── */}
        <section
          className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto w-full relative"
          aria-labelledby="hero-heading"
        >
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-oscilloscope-grid opacity-30 pointer-events-none" />

        {/* Status Pill */}
        <div className="relative inline-flex items-center gap-2 rounded border border-border-subtle bg-surface-panel px-3 py-1 text-[10px] text-muted-foreground font-mono mb-8 shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse" aria-hidden="true" />
          <span className="uppercase tracking-wider font-bold">Educational Software Simulation · No Hardware Required</span>
        </div>

        <h1
          id="hero-heading"
          className="relative text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight font-sans"
        >
          EmbeddedLab
          <span className="text-primary"> OS</span>
        </h1>

        <p className="relative text-lg sm:text-xl text-muted-foreground font-light mb-3 max-w-xl font-sans">
          Learn Embedded Systems.{" "}
          <span className="text-foreground font-semibold">Experiment.</span>{" "}
          Understand.
        </p>

        <p className="relative text-[11px] text-muted-foreground max-w-lg mb-8 leading-relaxed font-mono">
          A browser-based virtual laboratory for engineering students. Configure
          virtual peripherals, run guided experiments, and observe real
          calculations — without physical hardware.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-2.5 items-center">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", className: "font-mono text-xs font-bold shadow-lg" })}
          >
            Start Lab
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/labs"
            className={buttonVariants({ variant: "outline", size: "lg", className: "font-mono text-xs font-bold" })}
          >
            Explore Labs
          </Link>
        </div>
      </section>

      {/* ── Value Propositions ── */}
      <section
        className="border-t border-border-default bg-surface-panel/50 px-6 py-12"
        aria-labelledby="features-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="features-heading"
            className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground text-center mb-10"
          >
            What You Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUE_PROPS.map((vp) => {
              const Icon = vp.icon;
              return (
                <div key={vp.title} className="space-y-2">
                  <div
                    className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                    {vp.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                    {vp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Lab Preview Cards ── */}
      <section
        className="px-6 py-12"
        aria-labelledby="labs-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2
                id="labs-heading"
                className="text-base font-bold text-foreground font-sans"
              >
                Four Interactive Labs
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Each lab simulates a core embedded peripheral with guided challenges.
              </p>
            </div>
            <Link
              href="/labs"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "text-[10px] font-mono font-bold" })}
            >
              View all
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LABS.map((lab) => {
              const Icon = ICON_MAP[lab.icon] ?? Zap;
              return (
                <Link
                  key={lab.id}
                  href={lab.route}
                  className="group rounded border border-border-default bg-surface-panel p-4 hover:border-primary/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all"
                  aria-label={`Open ${lab.shortTitle} lab`}
                >
                  <div
                    className="w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center mb-3"
                    aria-hidden="true"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-1">
                    {lab.shortTitle}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-3 font-sans">
                    {lab.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-primary font-mono font-bold">
                    <span>Open lab</span>
                    <ArrowRight
                      className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      </main>
      <MarketingFooter />
    </div>
  );
}
