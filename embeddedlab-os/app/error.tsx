"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-lg bg-[var(--feedback-error)]/10 border border-[var(--feedback-error)]/20 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-[var(--feedback-error)]" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
        System Runtime Error
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6 font-mono text-xs">
        {error.message || "An unexpected error occurred in the application shell."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Reload Application State
      </Button>
    </div>
  );
}
