/**
 * EmbeddedLab OS — app/(auth)/signup/page.tsx
 * Student registration portal.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Cpu, KeyRound, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy to register.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const { error } = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleDemoMode = () => {
    router.push("/dashboard");
  };

  const inputClasses =
    "w-full bg-[var(--surface-console)] border border-[var(--border-subtle)] rounded px-3 py-2 text-foreground text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60 transition-colors";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-oscilloscope-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-sm space-y-5 relative">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-primary/10 border border-primary/20 text-primary mb-2">
            <Cpu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight font-sans">
            EmbeddedLab OS
          </h1>
          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider font-bold">
            Create Student Account
          </p>
        </div>

        {/* Signup Panel */}
        <div className="rounded border border-border-default bg-surface-panel p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="border-b border-border-subtle pb-2.5">
            <h2 className="text-[10px] font-bold text-foreground uppercase tracking-wider font-mono">
              Account Registration
            </h2>
            <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
              Register to save progress and track challenge scores across sessions.
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-2 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-mono flex items-center gap-1.5"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-[10px] font-mono">
            <div className="space-y-1">
              <label
                htmlFor="signup-fullname"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <User className="h-3 w-3 text-primary" aria-hidden="true" />
                Full Name
              </label>
              <input
                id="signup-fullname"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <Mail className="h-3 w-3 text-primary" aria-hidden="true" />
                Email Address
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <KeyRound className="h-3 w-3 text-primary" aria-hidden="true" />
                Password (min 6 chars)
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-confirm-password"
                className="text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]"
              >
                <KeyRound className="h-3 w-3 text-primary" aria-hidden="true" />
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={inputClasses}
              />
            </div>

            {/* Explicit, Unbundled Privacy & Terms Consent */}
            <div className="pt-1.5 flex items-start gap-2">
              <input
                type="checkbox"
                id="signup-consent-checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
                className="mt-0.5 rounded border-border-default text-primary focus:ring-primary h-3.5 w-3.5 shrink-0 cursor-pointer"
              />
              <label
                htmlFor="signup-consent-checkbox"
                className="text-[10px] text-muted-foreground font-sans leading-relaxed cursor-pointer select-none"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-primary hover:underline font-mono font-semibold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-primary hover:underline font-mono font-semibold"
                >
                  Privacy Policy
                </Link>
                , and consent to the storage of my learning progress.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-mono text-[10px] font-bold h-8 control-elevated mt-2"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Button>
          </form>

          {/* Student Privacy & Data Minimization Notice */}
          <div className="rounded border border-primary/30 bg-surface-panel p-2.5 text-[9px] font-sans text-muted-foreground leading-relaxed">
            <span className="text-foreground font-mono font-bold block uppercase tracking-wider text-[8.5px] mb-0.5">
              🛡️ Student Privacy Notice
            </span>
            EmbeddedLab OS never sells data, tracks cross-site behavior, or displays ads. You may also
            learn anonymously without registering by selecting Demo Mode below.
          </div>

          <div className="pt-2 border-t border-border-subtle flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleDemoMode}
              className="w-full font-mono text-[10px] h-7 font-bold"
            >
              Launch Instant Demo Mode (Anonymous)
            </Button>

            <div className="text-center text-[9px] font-mono text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
