/**
 * EmbeddedLab OS — app/(app)/labs/page.tsx
 * Lab selection directory with engineering layout.
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
    <div className="p-4 max-w-5xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="pb-3 border-b border-border-default">
        <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
          <FlaskConical className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} aria-hidden="true" />
          <span>LAB DIRECTORY</span>
          <span>·</span>
          <span className="text-primary font-bold">4 WORKBENCHES</span>
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Virtual Embedded Labs
        </h1>
        <p className="mt-0.5 text-[10px] text-muted-foreground max-w-xl font-mono">
          Each lab simulates a core embedded peripheral. Work through the objectives,
          complete the challenges, and observe real engineering calculations.
        </p>
      </div>

      {/* Engineering Disclaimer */}
      <div className="rounded border border-border-subtle bg-surface-sunken px-3 py-2 text-[9px] text-muted-foreground font-mono uppercase tracking-wider shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
        ⓘ Educational software simulations. These model relevant concepts accurately for learning purposes but do not emulate real MCU hardware.
      </div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
        {LABS.map((lab) => (
          <div key={lab.id} role="listitem">
            <LabCard lab={lab} status="active" showObjectives />
          </div>
        ))}
      </div>
    </div>
  );
}
