/**
 * EmbeddedLab OS — app/(marketing)/cookies/page.tsx
 * Cookie & Local Storage Policy — Technical transparency regarding browser storage.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Cookie,
  Database,
  Info,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { LEGAL_CONFIG } from "@/lib/constants/legal";

export const metadata: Metadata = {
  title: "Cookie & Storage Policy",
  description:
    "Detailed breakdown of cookies, session tokens, and local storage mechanisms used by EmbeddedLab OS.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNav showBackHome />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-border-default pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
            <Cookie className="h-3 w-3" aria-hidden="true" />
            <span>Storage & Transparency Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Cookie & Storage Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Effective Date: {LEGAL_CONFIG.effectiveDate}</span>
            <span>·</span>
            <span>Last Updated: {LEGAL_CONFIG.lastUpdated}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Strictly Necessary & Functional Storage Only</span>
          </div>
        </div>

        {/* Overview Box */}
        <div className="rounded-lg border border-border-default bg-surface-panel p-5 space-y-2 text-xs font-sans">
          <h2 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Zero Tracking Architecture
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            EmbeddedLab OS does <strong>not use third-party advertising cookies, behavioral tracking pixels,
            or cross-site analytics scripts</strong>. The only storage technologies utilized are strictly
            necessary session authentication cookies and client-side browser <code className="text-primary font-mono">localStorage</code>{" "}
            to persist your laboratory challenge progress and hardware configuration state.
          </p>
        </div>

        {/* Classification Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded border border-emerald-500/25 bg-emerald-500/5 space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold uppercase text-[11px]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>What We Use (Strictly Necessary)</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Session Cookies:</strong> Encrypted Supabase Auth tokens for logged-in students to maintain secure session continuity.
              </li>
              <li>
                <strong className="text-foreground">Local Storage:</strong> Preserving active challenge state, hint visibility, and challenge scores on your device.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded border border-border bg-surface-panel space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-muted-foreground font-bold uppercase text-[11px]">
              <XCircle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              <span>What We Do NOT Use</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground leading-relaxed">
              <li>No Google Analytics / Tag Manager tracking</li>
              <li>No Meta, LinkedIn, or TikTok pixels</li>
              <li>No cross-site fingerprinting or data brokers</li>
              <li>No marketing, retargeting, or advertising beacons</li>
            </ul>
          </div>
        </div>

        {/* Detailed Storage Registry Table */}
        <section className="space-y-4 text-xs font-sans" aria-labelledby="storage-table-title">
          <h2 id="storage-table-title" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Database className="h-4 w-4 text-primary" aria-hidden="true" />
            Complete Browser Storage Inventory
          </h2>
          <div
            tabIndex={0}
            role="region"
            aria-label="Browser Storage Inventory Table"
            className="rounded border border-border-default overflow-x-auto focus-visible:outline-2 focus-visible:outline-primary"
          >
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="bg-surface-sunken border-b border-border-default text-muted-foreground uppercase text-[9px] tracking-wider">
                  <th className="p-3">Identifier / Key</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {LEGAL_CONFIG.storageItems.map((item) => (
                  <tr key={item.name} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="p-3 font-bold text-primary font-mono">{item.name}</td>
                    <td className="p-3 text-muted-foreground">{item.type}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground font-sans text-xs">{item.purpose}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{item.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Managing & Wiping Storage */}
        <section className="space-y-4 text-xs font-sans leading-relaxed" aria-labelledby="storage-manage">
          <h2 id="storage-manage" className="text-base font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
            <Trash2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Managing & Wiping Your Storage
          </h2>
          <p className="text-muted-foreground">
            Because EmbeddedLab OS uses strictly functional and necessary storage, no annoying cookie
            consent wall is mandated under EU ePrivacy Directive and GDPR (strictly necessary exemptions apply).
            However, we give you 100% control to inspect or wipe your data anytime:
          </p>
          <div className="p-4 rounded border border-border-default bg-surface-panel space-y-3 font-mono text-xs">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground">Self-Service Storage Flush:</span>
                <p className="text-muted-foreground font-sans text-xs">
                  Go to <Link href="/settings" className="text-primary underline">Workstation Settings</Link>{" "}
                  and click <strong>&quot;Wipe Local Simulation Data&quot;</strong>. This immediately removes all
                  cached challenge progress, hardware register values, and attempts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-border-subtle">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground">Browser Cookie Controls:</span>
                <p className="text-muted-foreground font-sans text-xs">
                  You can block or delete cookies via your browser settings (Chrome, Firefox, Safari, Edge).
                  Note that disabling cookies prevents cloud-synced account logins from remembering your session,
                  though Local Offline Demo Mode will continue to operate normally.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
