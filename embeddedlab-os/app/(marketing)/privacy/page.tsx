/**
 * EmbeddedLab OS — app/(marketing)/privacy/page.tsx
 * Comprehensive, plain-language Privacy Policy.
 * Grounded in the actual technical implementation of EmbeddedLab OS.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Cpu,
  Database,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { LEGAL_CONFIG } from "@/lib/constants/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Plain-language explanation of how EmbeddedLab OS collects, handles, protects, and deletes student educational data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNav showBackHome />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-border-default pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
            <Shield className="h-3 w-3" aria-hidden="true" />
            <span>Privacy & Transparency Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Effective Date: {LEGAL_CONFIG.effectiveDate}</span>
            <span>·</span>
            <span>Last Updated: {LEGAL_CONFIG.lastUpdated}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Zero Advertising / No Tracking Cookies</span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="rounded-lg border border-primary/30 bg-surface-panel p-5 space-y-2 text-xs font-sans">
          <h2 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Core Privacy Commitment
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            EmbeddedLab OS is an educational virtual laboratory designed for engineering students
            and educators. We practice strict data minimization: we do not sell student data, we do
            not run third-party advertising, we do not deploy cross-site tracking cookies, and we
            never send personal student identities to third-party artificial intelligence services.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-collect">
          <h2 id="section-collect" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Database className="h-4 w-4 text-primary" aria-hidden="true" />
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We collect only the minimum data strictly necessary to deliver the educational
            simulation and verify challenge milestones:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-1.5">
              <strong className="text-foreground uppercase block text-[10px] tracking-wider text-primary">
                A. Student Account Data (Optional)
              </strong>
              <p className="text-muted-foreground font-sans text-xs">
                When you voluntarily register a student account, we collect your <strong>email address</strong>,{" "}
                <strong>full name</strong>, and a cryptographically hashed password. In offline demo mode,
                no account registration is required.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-1.5">
              <strong className="text-foreground uppercase block text-[10px] tracking-wider text-primary">
                B. Learning Progress & Challenge Scores
              </strong>
              <p className="text-muted-foreground font-sans text-xs">
                When you test lab challenges, we store completion status, scores earned, attempt counts,
                and timestamp records. This data enables your progress dashboard and score tracking.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-1.5">
              <strong className="text-foreground uppercase block text-[10px] tracking-wider text-primary">
                C. Microcontroller Simulation State
              </strong>
              <p className="text-muted-foreground font-sans text-xs">
                Peripheral settings (GPIO pin levels, PWM frequencies, ADC voltages, UART frame buffers)
                are calculated and processed client-side in your browser memory and synchronized locally
                via <code className="text-primary font-mono">localStorage</code>.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-1.5">
              <strong className="text-foreground uppercase block text-[10px] tracking-wider text-primary">
                D. Technical Telemetry & Diagnostic Logs
              </strong>
              <p className="text-muted-foreground font-sans text-xs">
                The workstation maintains a rolling in-memory diagnostic log (up to 200 events) of
                simulated hardware events (e.g. edge detections, framing errors) visible in your lab console.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Information */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-usage">
          <h2 id="section-usage" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
            2. How We Use Your Information
          </h2>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>
              <strong className="text-foreground">Delivering Virtual Labs:</strong> Simulating microcontroller
              peripherals (STM32-style GPIO, PWM timers, ADC channels, and UART transceivers).
            </li>
            <li>
              <strong className="text-foreground">Objective Verification:</strong> Evaluating whether your
              hardware configuration satisfies challenge criteria and computing your lab scores.
            </li>
            <li>
              <strong className="text-foreground">Session Continuity:</strong> Allowing you to resume
              experiments across browser restarts without losing progress.
            </li>
            <li>
              <strong className="text-foreground">AI Engineering Guidance:</strong> Providing conceptual hints
              and bug diagnoses when you click the AI Assistant buttons in a lab.
            </li>
          </ul>
        </section>

        {/* Section 3: AI Tutoring & Data Minimization */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-ai">
          <h2 id="section-ai" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <EyeOff className="h-4 w-4 text-primary" aria-hidden="true" />
            3. AI Tutoring & Strict Data Sanitization
          </h2>
          <p className="text-muted-foreground">
            EmbeddedLab OS integrates Google Gemini AI through a secure, server-side proxy
            (<code className="text-primary font-mono text-[11px]">/api/ai</code>) to assist with concept
            explanations, challenge hints, and framing debugging.
          </p>
          <div className="p-3.5 rounded border border-border-subtle bg-surface-sunken space-y-2 font-mono text-[11px]">
            <p className="text-foreground font-bold text-xs">
              🛡️ Data Minimization Guarantee for AI Queries:
            </p>
            <p className="text-muted-foreground font-sans text-xs">
              Our sanitization layer (<code className="text-primary font-mono text-[11px]">lib/ai/sanitizer.ts</code>)
              strips all student identifiers before sending context to the AI model. Gemini receives
              only numeric peripheral values (e.g. <code className="text-foreground">voltage: 2.5V</code>,{" "}
              <code className="text-foreground">baud: 9600</code>, <code className="text-foreground">dutyCycle: 50%</code>)
              and recent simulator console errors. Your name, email, IP address, and student ID are{" "}
              <strong>never transmitted</strong> to Google AI.
            </p>
          </div>
        </section>

        {/* Section 4: Third-Party Processors */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-third-parties">
          <h2 id="section-third-parties" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
            4. Third-Party Service Providers
          </h2>
          <p className="text-muted-foreground">
            We only engage service providers necessary to operate the platform infrastructure:
          </p>
          <div className="space-y-2.5">
            {LEGAL_CONFIG.thirdPartyServices.map((service) => (
              <div
                key={service.name}
                className="p-3 rounded border border-border-subtle bg-surface-panel flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <h3 className="font-bold text-foreground font-mono text-[11px]">{service.name}</h3>
                  <p className="text-muted-foreground font-sans mt-0.5 text-[11px]">{service.purpose}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Data: <span className="text-foreground">{service.dataShared}</span>
                  </p>
                </div>
                <a
                  href={service.privacyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary hover:underline text-[10px] font-mono shrink-0"
                >
                  Privacy Notice ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Student & Minor Data Protection */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-minors">
          <h2 id="section-minors" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            5. Student & Minor Data Protection
          </h2>
          <p className="text-muted-foreground">
            EmbeddedLab OS is primarily used by secondary and university engineering students.
            We take youth and student privacy seriously:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
            <li>We do not condition participation on disclosing more personal data than necessary.</li>
            <li>We do not serve targeted advertisements or build behavioral advertising profiles.</li>
            <li>We do not sell, rent, or trade student records under any circumstances.</li>
            <li>
              Students can use the platform entirely anonymously via{" "}
              <strong>Local Offline Demo Mode</strong> without registering an account or providing an email.
            </li>
            <li>
              Parents, educators, and eligible students may inspect or request the deletion of student
              learning records at any time.
            </li>
          </ul>
        </section>

        {/* Section 6: Data Deletion & Rights */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-deletion">
          <h2 id="section-deletion" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Trash2 className="h-4 w-4 text-primary" aria-hidden="true" />
            6. Data Deletion & Student Rights
          </h2>
          <p className="text-muted-foreground">
            You retain complete control over your data. EmbeddedLab OS provides immediate self-service
            and documented deletion flows:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-2">
              <strong className="font-mono text-foreground uppercase block text-[10px] text-primary">
                Immediate Browser Data Wipe
              </strong>
              <p className="text-muted-foreground font-sans leading-relaxed text-[11px]">
                In the <Link href="/settings" className="text-primary underline">Settings</Link> page,
                clicking <strong>&quot;Wipe Local Simulation Data&quot;</strong> instantly purges all challenge attempts,
                hardware memory, and local score caches from your device.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border-subtle bg-surface-panel space-y-2">
              <strong className="font-mono text-foreground uppercase block text-[10px] text-primary">
                Cloud Account Deletion Request
              </strong>
              <p className="text-muted-foreground font-sans leading-relaxed text-[11px]">
                Registered students can request complete erasure of their Supabase profile, authentication
                credentials, and challenge history by emailing{" "}
                <a href={`mailto:${LEGAL_CONFIG.verifiedContactEmail}`} className="text-primary underline">
                  {LEGAL_CONFIG.verifiedContactEmail}
                </a>{" "}
                or using the deletion modal in Settings. Erasure is processed within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Verified Contact Information */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="section-contact">
          <h2 id="section-contact" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            7. Contact & Transparency Information
          </h2>
          <p className="text-muted-foreground">
            If you have questions, privacy requests, or security inquiries regarding EmbeddedLab OS,
            please contact the project maintainer:
          </p>
          <div className="p-4 rounded border border-border-default bg-surface-panel font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Project:</span>
              <span className="text-foreground font-bold">{LEGAL_CONFIG.appName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Developer / Maintainer:</span>
              <span className="text-foreground">{LEGAL_CONFIG.authorName} ({LEGAL_CONFIG.developerHandle})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Direct Email:</span>
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
