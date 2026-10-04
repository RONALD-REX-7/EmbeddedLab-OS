/**
 * EmbeddedLab OS — components/layout/marketing-footer.tsx
 * Precision technical footer for landing and policy pages.
 * Fully transparent, accessible, and connected to verified project information.
 */
import Link from "next/link";
import { Cpu, ExternalLink, Mail, Shield } from "lucide-react";
import { LEGAL_CONFIG } from "@/lib/constants/legal";
import { GithubIcon } from "@/components/shared/icons";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-default bg-surface-panel/40 px-6 py-8 mt-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Upper Footer: Brand & Link Groups */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-border-subtle text-xs font-mono">
          {/* Column 1: Brand & Project Identity */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cpu className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden="true" />
              </div>
              <span className="font-bold tracking-wider text-foreground">
                EmbeddedLab <span className="text-primary font-bold">OS</span>
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed max-w-sm">
              Interactive virtual embedded systems laboratory for engineering students.
              Deterministic software simulation of GPIO, PWM, ADC, and UART peripherals —
              zero hardware required.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <a
                href={LEGAL_CONFIG.repositoryUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" aria-hidden="true" />
              </a>
              <span className="text-border">·</span>
              <a
                href={`mailto:${LEGAL_CONFIG.verifiedContactEmail}`}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{LEGAL_CONFIG.verifiedContactEmail}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Laboratories */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground">
              Laboratories
            </h3>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li>
                <Link href="/labs/gpio" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  GPIO Digital I/O
                </Link>
              </li>
              <li>
                <Link href="/labs/pwm" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  PWM Waveforms
                </Link>
              </li>
              <li>
                <Link href="/labs/adc" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  ADC Quantization
                </Link>
              </li>
              <li>
                <Link href="/labs/uart" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  UART Transceiver
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" aria-hidden="true" />
              Trust & Legal
            </h3>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  Cookie & Storage Policy
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
                  Data & Storage Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Footer: Operational Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {LEGAL_CONFIG.appName}</span>
            <span>·</span>
            <span>Developed by {LEGAL_CONFIG.authorName}</span>
          </div>

          <p className="text-center sm:text-right text-[10px] text-muted-foreground">
            Educational virtual software simulation · Not a physical microcontroller
          </p>
        </div>
      </div>
    </footer>
  );
}
