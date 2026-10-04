/**
 * EmbeddedLab OS — app/(marketing)/terms/page.tsx
 * Terms of Service — Clear, plain-language engineering and educational platform terms.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Cpu,
  FileCheck,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { LEGAL_CONFIG } from "@/lib/constants/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service, acceptable use guidelines, simulation disclaimers, and user responsibilities for EmbeddedLab OS.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNav showBackHome />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-border-default pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
            <Scale className="h-3 w-3" aria-hidden="true" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Terms of Service
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Effective Date: {LEGAL_CONFIG.effectiveDate}</span>
            <span>·</span>
            <span>Last Updated: {LEGAL_CONFIG.lastUpdated}</span>
            <span>·</span>
            <span className="text-primary font-semibold">Educational Software Simulation License</span>
          </div>
        </div>

        {/* Section 1: Acceptance & Educational Scope */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-scope">
          <h2 id="terms-scope" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            1. Acceptance of Terms & Educational Scope
          </h2>
          <p className="text-muted-foreground">
            By accessing or using <strong>EmbeddedLab OS</strong>, you agree to comply with and be bound
            by these Terms of Service. If you do not agree, you must not use the platform.
          </p>
          <p className="text-muted-foreground">
            EmbeddedLab OS is provided free of charge for students, educators, and embedded engineering
            enthusiasts to learn microcontroller peripherals (GPIO, PWM, ADC, and UART) through software
            experiments and interactive challenges.
          </p>
        </section>

        {/* Section 2: Technical Simulation Disclaimer */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-disclaimer">
          <h2 id="terms-disclaimer" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
            2. Simulation Disclaimer & Engineering Limitations
          </h2>
          <div className="p-4 rounded border border-amber-500/25 bg-amber-500/5 space-y-2 text-xs font-sans">
            <strong className="text-amber-400 font-mono uppercase block text-[11px] tracking-wider">
              ⚠️ Educational Software Simulation Notice
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              EmbeddedLab OS provides <strong>deterministic software behavioral simulations</strong> designed
              for pedagogical understanding. While peripheral formulas (such as ADC quantization, PWM duty
              cycle, and UART framing) reflect genuine engineering equations, the platform{" "}
              <strong>does not emulate electrical transistor physics, silicon parasitic capacitances, or
              board-level thermal phenomena</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Not for Production or Mission-Critical Use:</strong> Calculations and virtual circuits
              must never be used as the sole basis for designing medical equipment, aerospace navigation,
              automotive braking, life-support, or hazardous industrial control systems without independent
              physical hardware testing and formal laboratory verification.
            </p>
          </div>
        </section>

        {/* Section 3: Acceptable Use Policy */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-acceptable">
          <h2 id="terms-acceptable" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            3. Acceptable Use Policy
          </h2>
          <p className="text-muted-foreground">When using EmbeddedLab OS, you agree not to:</p>
          <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
            <li>
              Attempt to disrupt, overload, or impair the platform servers or API endpoints (including automated scraping or denial-of-service).
            </li>
            <li>
              Abuse the server-side AI Assistant endpoint (<code className="text-primary font-mono text-[11px]">/api/ai</code>)
              for non-educational queries, automated prompt injection, or bulk generation.
            </li>
            <li>
              Attempt to bypass authentication, forge challenge validation results in shared leaderboards, or impersonate other students.
            </li>
            <li>
              Transmit viruses, malicious payloads, or infringing materials through user profile fields.
            </li>
          </ul>
        </section>

        {/* Section 4: Intellectual Property */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-ip">
          <h2 id="terms-ip" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
            4. Intellectual Property & Code Rights
          </h2>
          <p className="text-muted-foreground">
            The platform source code, user interface designs, custom SVGs, simulation logic, and
            educational curricula are the intellectual property of <strong>{LEGAL_CONFIG.authorName}</strong>{" "}
            and contributors, protected under copyright and applicable intellectual property laws.
          </p>
          <p className="text-muted-foreground">
            Students and educators are granted a personal, revocable, non-exclusive license to use the
            workstation for academic coursework, study, and classroom instruction.
          </p>
        </section>

        {/* Section 5: Student Accounts & Demo Mode */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-accounts">
          <h2 id="terms-accounts" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <FileCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            5. Student Accounts & Local Demo Mode
          </h2>
          <p className="text-muted-foreground">
            EmbeddedLab OS allows full access via <strong>Local Offline Demo Mode</strong> without
            requiring an account. If you choose to create a cloud-synced student account:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must provide an accurate email address for account recovery.</li>
            <li>
              You may terminate your account at any time and request data erasure via the{" "}
              <Link href="/settings" className="text-primary underline">Settings</Link> interface.
            </li>
          </ul>
        </section>

        {/* Section 6: Service Changes & Discontinuation */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-changes">
          <h2 id="terms-changes" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
            6. Service Modifications & Warranty Disclaimers
          </h2>
          <p className="text-muted-foreground">
            The platform is provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis,
            without warranties of any kind, whether express or implied. We reserve the right to modify,
            update, or temporarily suspend any simulation feature or challenge suite as the curriculum evolves.
          </p>
        </section>

        {/* Section 7: Contact Information */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="terms-contact">
          <h2 id="terms-contact" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            7. Inquiries & Contact
          </h2>
          <p className="text-muted-foreground">
            Questions regarding these Terms of Service should be directed to the maintainer:
          </p>
          <div className="p-4 rounded border border-border-default bg-surface-panel font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Author:</span>
              <span className="text-foreground">{LEGAL_CONFIG.authorName} ({LEGAL_CONFIG.developerHandle})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Email:</span>
              <a href={`mailto:${LEGAL_CONFIG.verifiedContactEmail}`} className="text-primary hover:underline">
                {LEGAL_CONFIG.verifiedContactEmail}
              </a>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Source Repository:</span>
              <a href={LEGAL_CONFIG.repositoryUrl} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
                {LEGAL_CONFIG.repositoryUrl}
              </a>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Project Status:</span>
              <span className="text-foreground">{LEGAL_CONFIG.projectType}</span>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
