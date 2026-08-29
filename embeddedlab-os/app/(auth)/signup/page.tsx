/**
 * EmbeddedLab OS — app/(auth)/signup/page.tsx
 * Student signup page with Supabase Auth.
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        {/* Signup Form Panel */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-xl">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
              Create Student Account
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Register to save progress and track challenge scores.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

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
                Password (min. 6 characters)
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

            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-mono text-xs font-semibold h-9 mt-2"
            >
              {isSubmitting ? "Creating Account..." : "Register Account"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </form>

          <div className="pt-3 border-t border-border/80 text-center text-[11px] font-mono text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
