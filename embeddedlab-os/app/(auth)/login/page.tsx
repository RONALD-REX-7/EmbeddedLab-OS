/**
 * EmbeddedLab OS — app/(auth)/login/page.tsx
 * Professional engineering login page with Supabase Auth and Demo Mode fallback.
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

  const { signIn, isConfigured } = useAuth();
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
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 text-primary mb-2">
            <Cpu className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            EmbeddedLab OS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Interactive Virtual Microcontroller Laboratory
          </p>
        </div>

        {/* Demo Mode Notification Banner */}
        {!isConfigured && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-3 text-xs font-mono text-amber-400">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">LOCAL DEMO MODE ACTIVE</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Supabase credentials not configured in environment. The platform will run in offline demo mode using local storage.
              </p>
            </div>
          </div>
        )}

        {/* Login Form Panel */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-xl">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
              Account Authentication
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sign in to sync your laboratory challenge progress.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@embeddedlab.org"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-mono text-xs font-semibold h-9"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Laboratory"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Quick Demo Mode Launch */}
          <div className="pt-3 border-t border-border/80 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoMode}
              className="w-full font-mono text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Enter Instant Demo Mode
            </Button>
            <div className="text-center pt-1 text-[11px] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-bold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
