/**
 * EmbeddedLab OS — app/(app)/settings/page.tsx
 * Precision Engineering Workstation Settings & Data Management Portal.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  ExternalLink,
  Lock,
  Mail,
  RefreshCw,
  Scale,
  Settings,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  wipeLocalStorageData,
  deleteUserAccountData,
  exportUserData,
} from "@/lib/supabase/db";
import { LEGAL_CONFIG } from "@/lib/constants/legal";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isDemoMode, isConfigured, signOut } = useAuth();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [isWiping, setIsWiping] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleWipeLocalData = () => {
    setIsWiping(true);
    const result = wipeLocalStorageData();
    setIsWiping(false);
    if (result.success) {
      setNotification({
        type: "success",
        message: `Successfully cleared ${result.clearedKeysCount} local simulation storage keys.`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setNotification({
        type: "error",
        message: "Failed to access browser local storage.",
      });
    }
  };

  const handleExportData = async () => {
    const userId = user?.id || "demo-user-id";
    const data = await exportUserData(userId);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `embeddedlab-os-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotification({
      type: "success",
      message: "Exported learning records and local storage to JSON.",
    });
  };

  const handleConfirmAccountDeletion = async () => {
    setIsDeleting(true);
    const userId = user?.id || "demo-user-id";
    const result = await deleteUserAccountData(userId);
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (result.success) {
      setNotification({
        type: "success",
        message:
          "All challenge records and local simulation data have been permanently deleted.",
      });
      if (user && !isDemoMode) {
        await signOut();
      }
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setNotification({
        type: "error",
        message: result.error || "Failed to complete data erasure.",
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-7">
      {/* Header */}
      <div className="border-b border-border-default pb-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Settings className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider">Preferences & Controls</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground font-sans tracking-tight">
          Workstation & Data Management
        </h1>
        <p className="mt-1 text-xs text-muted-foreground max-w-xl font-mono">
          Manage student profile, simulation engine parameters, privacy controls, and data erasure.
        </p>
      </div>

      {/* Action Notification Banner */}
      {notification && (
        <div
          role="status"
          className={`p-3 rounded border font-mono text-xs flex items-center justify-between gap-3 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : notification.type === "error"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-primary/10 border-primary/30 text-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[10px] uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Account & Simulator Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* User Account Section */}
        <div className="rounded border border-border-default bg-surface-panel p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                User Profile & Authentication
              </h2>
            </div>
            {isDemoMode ? (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-600/30 dark:border-amber-500/30 uppercase">
                Offline Demo
              </span>
            ) : (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 dark:border-emerald-500/30 uppercase">
                Cloud Synced
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Account Identifier:</span>
              <span className="text-foreground truncate max-w-48 font-medium">
                {user?.email || "Guest Student (demo@embeddedlab.org)"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Display Name:</span>
              <span className="text-foreground font-medium">
                {user?.user_metadata?.full_name || "Student Engineer"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Storage Mode:</span>
              <StatusBadge status={isDemoMode ? "demo" : "active"} />
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
            {isConfigured
              ? "Your progress synchronizes securely with Supabase cloud storage."
              : "Supabase credentials are not configured. Running fully offline with local browser storage."}
          </p>

          <div className="pt-2 flex items-center gap-2">
            {user && !isDemoMode ? (
              <Button
                variant="outline"
                size="xs"
                onClick={signOut}
                className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button size="xs" className="font-mono text-[10px] font-bold">
                  Sign In / Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Simulation Environment Section */}
        <div className="rounded border border-border-default bg-surface-panel p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Sliders className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Simulation Engine & AI Service
            </h2>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Engine Architecture:</span>
              <span className="text-foreground font-bold">Virtual STM32 Model</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Core Clock Rate:</span>
              <span className="text-emerald-800 dark:text-emerald-300 font-bold">16.0 MHz (Virtual)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">Event Ring Buffer:</span>
              <span className="text-foreground">200 events</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle/50">
              <span className="text-muted-foreground">AI Guidance Engine:</span>
              <span className="text-primary font-bold">Gemini 2.5 Flash / Fallback</span>
            </div>
          </div>

          <div className="rounded border border-primary/20 bg-surface-sunken p-2.5 text-[10px] font-mono text-foreground/80 dark:text-muted-foreground leading-relaxed flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong className="text-foreground font-bold">Strict Data Sanitization:</strong> AI requests transmit
              only technical peripheral parameters (voltages, frequencies, pin modes). No student PII is
              ever sent to AI models.
            </span>
          </div>
        </div>
      </div>

      {/* Visual Theme & Laboratory Display Settings */}
      <div className="rounded-xl border border-border/80 bg-surface-panel p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
            <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Display & Color Palette Theme
            </h2>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground uppercase">
            Persistent Preference
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-foreground">
              Laboratory Visual Theme
            </span>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed max-w-md">
              Switch between Light Mode (crisp porcelain surfaces with cobalt & lavender accents) and Dark Mode (refined navy & blue-black surfaces with phosphor traces).
            </p>
          </div>
          <ThemeToggle variant="pill" />
        </div>
      </div>

      {/* Data & Privacy Management Section */}
      <div className="rounded-xl border border-border/80 bg-surface-panel p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Data & Privacy Controls (Self-Service)
            </h2>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground uppercase">
            Data Minimization Standard
          </span>
        </div>

        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
          EmbeddedLab OS stores only challenge attempts, simulator register states, and student scores.
          You have full authority to export, reset, or permanently purge your records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Action 1: Export */}
          <div className="p-3.5 rounded border border-border-subtle bg-surface-sunken space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Data Portability
              </span>
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
                Download a JSON archive containing all challenge completion records, scores, and timestamps.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportData}
              className="w-full font-mono text-[10px] font-bold h-7 control-elevated"
            >
              Export JSON
            </Button>
          </div>

          {/* Action 2: Wipe Local Storage */}
          <div className="p-3.5 rounded border border-border-subtle bg-surface-sunken space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                Wipe Local Caches
              </span>
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
                Immediately flushes all offline simulator state, cached progress, and attempt logs from this browser.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              disabled={isWiping}
              onClick={handleWipeLocalData}
              className="w-full font-mono text-[10px] font-bold h-7 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 control-elevated"
            >
              {isWiping ? "Purging..." : "Wipe Local Storage"}
            </Button>
          </div>

          {/* Action 3: Account & Cloud Deletion */}
          <div className="p-3.5 rounded border border-border-subtle bg-surface-sunken space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-red-700 dark:text-red-400" aria-hidden="true" />
                Account Erasure
              </span>
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
                Permanently purge your student profile, cloud progress, and verification logs from all systems.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setShowDeleteModal(true)}
              className="w-full font-mono text-[10px] font-bold h-7 border-red-600/40 text-red-700 dark:text-red-400 hover:bg-red-500/10 control-elevated"
            >
              Request Data Erasure
            </Button>
          </div>
        </div>
      </div>

      {/* Cookie & Tracking Transparency Box */}
      <div className="rounded border border-border-default bg-surface-panel p-5 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Cookie & Storage Inventory
          </h2>
        </div>

        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
          EmbeddedLab OS operates under a <strong>Zero-Tracking Policy</strong>. We do not set third-party
          analytics trackers, marketing pixels, or advertising beacons.
        </p>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between py-1 border-b border-border-subtle/40">
            <span className="text-muted-foreground">Session Auth Cookie:</span>
            <span className="text-foreground">sb-*-auth-token (Strictly Necessary)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border-subtle/40">
            <span className="text-muted-foreground">Local Challenge Progress:</span>
            <span className="text-foreground">embeddedlab_challenge_progress_* (Functional)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border-subtle/40">
            <span className="text-muted-foreground">Analytics / Ad Trackers:</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">None (Zero trackers installed)</span>
          </div>
        </div>
      </div>

      {/* Trust, Legal & Business Information Section */}
      <div className="rounded border border-border-default bg-surface-panel p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Trust, Legal & Maintainer Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <Link
            href="/privacy"
            className="p-3 rounded border border-border-subtle bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </Link>
          <Link
            href="/terms"
            className="p-3 rounded border border-border-subtle bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
          >
            <span>Terms of Service</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </Link>
          <Link
            href="/cookies"
            className="p-3 rounded border border-border-subtle bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
          >
            <span>Cookie Policy</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>

        <div className="p-3.5 rounded border border-border-subtle bg-surface-sunken font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Developer / Maintainer:</span>
            <span className="text-foreground font-semibold">{LEGAL_CONFIG.authorName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">GitHub:</span>
            <a
              href={LEGAL_CONFIG.repositoryUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <GithubIcon className="h-3 w-3" />
              <span>{LEGAL_CONFIG.developerHandle}</span>
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Contact Email:</span>
            <a href={`mailto:${LEGAL_CONFIG.verifiedContactEmail}`} className="text-primary hover:underline inline-flex items-center gap-1">
              <Mail className="h-3 w-3" aria-hidden="true" />
              <span>{LEGAL_CONFIG.verifiedContactEmail}</span>
            </a>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border-subtle/50 text-[10px]">
            <span className="text-muted-foreground">Legal Entity / Registered Address:</span>
            <span className="text-muted-foreground italic">{LEGAL_CONFIG.legalEntityName}, {LEGAL_CONFIG.legalAddress}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Account / Data Deletion */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-lg border border-red-500/40 bg-surface-panel p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h3 id="modal-delete-title" className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                Confirm Permanent Data Erasure
              </h3>
            </div>

            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              This action is irreversible. All completed challenge records, earned scores,
              simulator caches, and profile credentials will be permanently erased.
            </p>

            <div className="p-3 rounded border border-border-subtle bg-surface-sunken font-mono text-[10px] space-y-1">
              <p className="text-foreground font-bold">What will be purged:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Browser localStorage simulation keys (<code className="text-primary">embeddedlab_*</code>)</li>
                <li>Supabase challenge attempt logs & scores</li>
                <li>Authentication session credentials</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmAccountDeletion}
                className="font-mono text-xs font-bold"
              >
                {isDeleting ? "Erasing Data..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
