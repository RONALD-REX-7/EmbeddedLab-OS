/**
 * EmbeddedLab OS — app/(marketing)/page.tsx
 * Landing page. Explains the platform, shows lab cards, CTA.
 * No fake data, no fake charts, no simulator functionality.
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
    title: "Virtual laboratory",
    description:
      "Experiment with GPIO, PWM, ADC, and UART peripherals in a deterministic software simulation.",
  },
  {
    icon: Cpu,
    title: "No hardware required",
    description:
      "Everything runs in the browser. No development board, no cables, no drivers.",
  },
  {
    icon: CheckCircle2,
    title: "Guided challenges",
    description:
      "Each lab includes structured challenges with progressive hints and automatic validation.",
  },
  {
    icon: Activity,
    title: "Real calculations",
    description:
      "ADC conversions, PWM timing, and UART frame analysis use actual engineering formulas — not approximations.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top nav ── */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <span className="font-semibold text-sm">
            <span className="text-foreground">EmbeddedLab</span>
            <span className="text-primary">OS</span>
          </span>
        </div>
        <nav className="flex items-center gap-4" aria-label="Top navigation">
          <Link
            href="/labs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Labs
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "sm" })}
          >
            Open Dashboard
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto w-full"
        aria-labelledby="hero-heading"
      >
        {/* Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--feedback-success)]" aria-hidden="true" />
          Educational virtual simulation · No hardware required
        </div>

        <h1
          id="hero-heading"
          className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight"
        >
          EmbeddedLab
          <span className="text-primary"> OS</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-3 max-w-xl">
          Learn Embedded Systems.{" "}
          <span className="text-foreground font-medium">Experiment.</span>{" "}
          Understand.
        </p>

        <p className="text-sm text-muted-foreground max-w-lg mb-10 leading-relaxed">
          A browser-based virtual laboratory for engineering students. Configure
          virtual peripherals, run guided experiments, and observe real
          calculations — without physical hardware.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg" })}
          >
            Start Lab
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/labs"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Explore Labs
          </Link>
        </div>
      </section>

      {/* ── Value propositions ── */}
      <section
        className="border-t border-border bg-card/30 px-6 py-14"
        aria-labelledby="features-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="features-heading"
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-10"
          >
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((vp) => {
              const Icon = vp.icon;
              return (
                <div key={vp.title} className="space-y-2">
                  <div
                    className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {vp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {vp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Lab cards ── */}
      <section
        className="px-6 py-14"
        aria-labelledby="labs-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                id="labs-heading"
                className="text-xl font-semibold text-foreground"
              >
                Four interactive labs
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Each lab simulates a core embedded peripheral with guided challenges.
              </p>
            </div>
            <Link
              href="/labs"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              View all
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LABS.map((lab) => {
              const Icon = ICON_MAP[lab.icon] ?? Zap;
              return (
                <Link
                  key={lab.id}
                  href={lab.route}
                  className="group rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:bg-card/80 transition-colors"
                  aria-label={`Open ${lab.shortTitle} lab`}
                >
                  <div
                    className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {lab.shortTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {lab.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <span>Open lab</span>
                    <ArrowRight
                      className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span>EmbeddedLab OS</span>
          </div>
          <p className="font-mono text-center sm:text-right">
            Educational virtual simulation · Not a real microcontroller
          </p>
        </div>
      </footer>
    </div>
  );
}
