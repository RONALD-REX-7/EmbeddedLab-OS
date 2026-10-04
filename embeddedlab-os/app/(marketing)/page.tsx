/**
 * EmbeddedLab OS — app/(marketing)/page.tsx
 * Serious Modern Engineering Lab & Student-Facing Platform Showcase.
 * Combines Apple-like educational clarity with precision laboratory aesthetics.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart2,
  Cpu,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { InteractiveHeroDemo } from "@/components/marketing/interactive-hero-demo";
import { LABS } from "@/lib/constants/labs";

export const metadata: Metadata = {
  title: "EmbeddedLab OS — Virtual Embedded Systems Laboratory",
  description:
    "Engineering-grade virtual laboratory for university students and embedded software engineers. Master GPIO, PWM, ADC, and UART through deterministic simulations and guided challenges — zero physical hardware required.",
};

const LAB_ICONS: Record<string, React.ElementType> = {
  Zap,
  Activity,
  BarChart2,
  Radio,
};

const ARCHITECTURE_PILLARS = [
  {
    icon: Cpu,
    title: "Deterministic State Machines",
    subtitle: "CYCLE-ACCURATE SOFTWARE LOGIC",
    description:
      "All register state transitions, clock edges, and interrupt flags evolve predictably according to strict microcontroller register specifications.",
  },
  {
    icon: Activity,
    title: "Mathematical Formula Verification",
    subtitle: "REAL PHYSICS & CALCULATIONS",
    description:
      "From SAR successive approximation ADC formulas to timer prescalers and UART baud divisors, every calculation reflects real hardware mathematics.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Hardware Friction",
    subtitle: "INSTANT ACCESSIBILITY",
    description:
      "No bricked dev boards, missing USB-TTL cables, or driver headaches. Jump straight into peripheral register manipulation in any modern web browser.",
  },
];

const CURRICULUM_STEPS = [
  {
    step: "01",
    label: "Digital Foundations",
    title: "GPIO & Bit Manipulation",
    lab: "GPIO Lab",
    href: "/labs/gpio",
    description: "Port registers, MODER, ODR, IDR, push-pull versus open-drain, and internal pull resistors.",
  },
  {
    step: "02",
    label: "Timing & Frequency",
    title: "PWM Waveform Synthesis",
    lab: "PWM Lab",
    href: "/labs/pwm",
    description: "Timer counter registers, auto-reload ARR, duty-cycle modulation, and oscilloscope analysis.",
  },
  {
    step: "03",
    label: "Mixed-Signal Sampling",
    title: "ADC Quantization & LSB",
    lab: "ADC Lab",
    href: "/labs/adc",
    description: "12-bit SAR quantization, reference voltage ratios, resolution formulas, and quantization error.",
  },
  {
    step: "04",
    label: "Serial Telemetry",
    title: "UART Asynchronous Framing",
    lab: "UART Lab",
    href: "/labs/uart",
    description: "Start/stop bits, baud divisors, parity checking, and packet transmission debugging.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors selection:bg-primary/20 selection:text-primary">
      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-mono focus:text-xs focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* ── Precision Marketing Navigation ── */}
      <MarketingNav />

      {/* ── Main Landmark ── */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* ── HERO SECTION ── */}
        <section
          className="relative px-4 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24 max-w-6xl mx-auto w-full flex flex-col items-center text-center"
          aria-labelledby="hero-heading"
        >
          {/* Subtle Technical Grid Background */}
          <div className="absolute inset-0 bg-oscilloscope-grid opacity-25 pointer-events-none" />

          {/* Status Telemetry Pill */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-panel/90 px-3.5 py-1 text-[11px] text-muted-foreground font-mono mb-8 shadow-2xs backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="uppercase tracking-wider font-semibold text-foreground">
              Virtual Engineering Lab
            </span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium">16 MHz Deterministic Engine</span>
          </div>

          {/* Hero Headline */}
          <h1
            id="hero-heading"
            className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6 font-sans"
          >
            The Virtual Laboratory for{" "}
            <span className="text-primary block sm:inline">
              Embedded Systems.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="relative text-base sm:text-xl text-muted-foreground font-normal max-w-2xl mb-8 leading-relaxed font-sans">
            Configure silicon microcontroller peripherals, analyze real waveforms, and master hardware register manipulation — entirely in your browser.
          </p>

          {/* Primary Action Group */}
          <div className="relative flex flex-col sm:flex-row gap-3 items-center mb-12 sm:mb-16">
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                className: "h-11 px-6 font-mono text-xs font-bold shadow-sm flex items-center gap-2",
              })}
            >
              <span>Launch Workstation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/labs"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-11 px-6 font-mono text-xs font-semibold bg-surface-panel/80 hover:bg-surface-elevated border-border",
              })}
            >
              <span>Browse 4 Labs</span>
            </Link>
          </div>

          {/* ── LIVE INTERACTIVE HERO DEMO WORKBENCH ── */}
          <div className="relative w-full">
            <InteractiveHeroDemo />
          </div>
        </section>

        {/* ── SYSTEM ARCHITECTURE & RIGOR ── */}
        <section
          className="border-t border-border/80 bg-surface-subtle/50 px-4 sm:px-6 py-16 md:py-20 transition-colors"
          aria-labelledby="architecture-heading"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
                Engineering Foundation
              </span>
              <h2
                id="architecture-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans"
              >
                Built for deep conceptual mastery, not surface flash.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                Traditional embedded courses struggle with equipment shortages, driver incompatibilities, and burnt components. EmbeddedLab OS provides a deterministic, zero-setup laboratory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ARCHITECTURE_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-border/80 bg-surface-panel p-6 space-y-3.5 shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-primary uppercase block">
                        {pillar.subtitle}
                      </span>
                      <h3 className="text-sm font-bold text-foreground font-mono">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── THE FOUR PERIPHERAL WORKBENCHES ── */}
        <section
          className="px-4 sm:px-6 py-16 md:py-20 max-w-6xl mx-auto w-full space-y-12"
          aria-labelledby="peripherals-heading"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary block mb-1">
                Laboratories & Workbenches
              </span>
              <h2
                id="peripherals-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans"
              >
                Four Core Silicon Peripherals
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-mono max-w-md">
              Each laboratory models an authentic STM32 peripheral subsystem with live register reflection and interactive challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LABS.map((lab) => {
              const Icon = LAB_ICONS[lab.icon] ?? Zap;
              return (
                <div
                  key={lab.id}
                  className="rounded-xl border border-border/80 bg-surface-panel p-6 space-y-4 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">
                            {lab.shortTitle} — {lab.title.split("—")[1]?.trim() || lab.title}
                          </h3>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {lab.challengeCount} Guided Challenges · No Hardware Required
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-foreground border border-border/70 uppercase">
                        INTERACTIVE
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {lab.description}
                    </p>

                    {/* Educational Objectives */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
                        Core Competencies:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-mono text-foreground/80">
                        {lab.objectives.slice(0, 4).map((obj, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                            <span className="truncate">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      4 Guided Challenges Available
                    </span>
                    <Link
                      href={lab.route}
                      className={buttonVariants({
                        size: "sm",
                        className: "h-7 text-[10px] font-mono font-semibold px-3",
                      })}
                    >
                      <span>Open Lab</span>
                      <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── STRUCTURED CURRICULUM ROADMAP ── */}
        <section
          className="border-t border-border/80 bg-surface-subtle/40 px-4 sm:px-6 py-16 md:py-20 transition-colors"
          aria-labelledby="curriculum-heading"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
                Learning Pathway
              </span>
              <h2
                id="curriculum-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans"
              >
                Progressive Engineering Curriculum
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                From fundamental digital inputs to high-speed serial packet analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CURRICULUM_STEPS.map((step) => (
                <Link
                  key={step.step}
                  href={step.href}
                  className="rounded-xl border border-border/80 bg-surface-panel p-5 space-y-3 shadow-2xs hover:border-primary/50 transition-colors flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">
                        {step.step}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">
                        {step.label}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground font-mono group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-primary font-semibold">
                    <span>{step.lab}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION BANNER ── */}
        <section
          className="border-t border-border/80 px-4 sm:px-6 py-16 md:py-20 bg-surface-panel transition-colors text-center"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Free & Open Engineering Platform</span>
            </div>

            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans"
            >
              Start experimenting immediately.
            </h2>

            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              No account required for full simulation access. Work through guided laboratory worksheets, analyze hardware registers, and verify your embedded systems knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 px-8 font-mono text-xs font-bold shadow-sm",
                })}
              >
                Launch Workstation
              </Link>
              <Link
                href="/labs"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-11 px-8 font-mono text-xs font-semibold bg-surface-panel",
                })}
              >
                View Lab Directory
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Precision Marketing Footer ── */}
      <MarketingFooter />
    </div>
  );
}
