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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative">
      <div className="absolute inset-0 bg-oscilloscope-grid opacity-15 pointer-events-none" />
      <div className="relative">
        <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3 mx-auto">
          <AlertTriangle className="h-5 w-5 text-red-400" strokeWidth={2} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground mb-1.5 font-sans">
          System Runtime Error
        </h1>
        <p className="text-[10px] text-muted-foreground max-w-sm mb-5 font-mono">
          {error.message || "An unexpected error occurred in the application shell."}
        </p>
        <Button onClick={() => reset()} variant="outline" size="sm" className="font-mono text-[10px] font-bold h-7">
          <RefreshCw className="mr-1 h-3 w-3" />
          Reload Application
        </Button>
      </div>
    </div>
  );
}
