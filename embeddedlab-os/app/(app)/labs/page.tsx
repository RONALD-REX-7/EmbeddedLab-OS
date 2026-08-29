/**
 * EmbeddedLab OS — app/(app)/labs/page.tsx
 * Lab selection page. Shows all four labs as cards.
 */
import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { LabCard } from "@/components/shared/lab-card";
import { LABS } from "@/lib/constants/labs";

export const metadata: Metadata = {
  title: "Labs",
};

export default function LabsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <FlaskConical className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider">Labs</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Virtual Embedded Labs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
          Each lab simulates a core embedded peripheral. Work through the
          objectives, complete the challenges, and observe real engineering
          calculations.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-md border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground font-mono">
        These are educational software simulations. They model the relevant
        concepts accurately for learning purposes but do not emulate real
        microcontroller hardware.
      </div>

      {/* Lab grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
        {LABS.map((lab) => (
          <div key={lab.id} role="listitem">
            <LabCard lab={lab} status="active" showObjectives />
          </div>
        ))}
      </div>
    </div>
  );
}
