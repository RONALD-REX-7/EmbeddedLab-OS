/**
 * EmbeddedLab OS — app/(auth)/login/page.tsx
 * Engineering-grade authentication portal.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Cpu, KeyRound, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, enterDemoMode, isConfigured } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
    router.push("/dashboard");
  };

  const inputClasses = "w-full bg-[var(--surface-console)] border border-[var(--border-subtle)] rounded px-3 py-2 text-foreground text-[10px] font-mono focus:outline-none focus:border-primary placeholder:text-muted-foreground/40 transition-colors";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-oscilloscope-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-sm space-y-5 relative">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-primary/10 border border-primary/20 text-primary mb-2">
            <Cpu className="h-5 w-5" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight font-sans">
            EmbeddedLab OS
          </h1>
          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider font-bold">
            Virtual Microcontroller Laboratory
          </p>
        </div>

        {/* Demo Mode Banner */}
        {!isConfigured && (
          <div className="rounded border border-amber-500/20 bg-amber-500/5 p-2.5 flex items-start gap-2 text-[10px] font-mono text-amber-400">
            <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase tracking-wider text-[9px]">Local Demo Mode</span>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Supabase not configured. Running in offline demo mode.
              </p>
            </div>
          </div>
        )}

        {/* Login Panel */}
        <div className="rounded border border-[var(--border-default)] bg-[var(--surface-panel)] p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="border-b border-[var(--border-subtle)] pb-2.5">
            <h2 className="text-[10px] font-bold text-foreground uppercase tracking-wider font-mono">
              Account Authentication
            </h2>
            <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
              Sign in to sync your challenge progress.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-mono flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-[10px] font-mono">
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <Mail className="h-3 w-3 text-primary" aria-hidden="true" />
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@embeddedlab.org"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="login-password"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <KeyRound className="h-3 w-3 text-primary" aria-hidden="true" />
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={inputClasses}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-mono text-[10px] font-bold h-8 control-elevated"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Button>
          </form>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleDemoMode}
              className="w-full font-mono text-[10px] h-7 font-bold"
            >
              <Sparkles className="mr-1 h-3 w-3 text-amber-400" aria-hidden="true" />
              Instant Demo Mode (Anonymous)
            </Button>
            <div className="text-center text-[9px] text-muted-foreground font-mono">
              No account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-bold">
                Create Account
              </Link>
            </div>
            <div className="text-center text-[8.5px] text-muted-foreground/80 font-mono pt-1 border-t border-border-subtle/50">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <span className="mx-1">·</span>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <span className="mx-1">·</span>
              <Link href="/cookies" className="hover:underline">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
