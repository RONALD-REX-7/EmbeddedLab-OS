import type { Metadata } from "next";
import { Settings, Sliders, User } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Settings className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider">Preferences</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Platform & Simulator Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
          Manage user profile, simulation parameters, and environment config.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Account Section */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              User Profile
            </h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-mono text-foreground">Guest Student</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Session Status:</span>
              <StatusBadge status="demo" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            User registration and persistent cloud storage will be activated when Supabase is connected in Phase 10.
          </p>
        </div>

        {/* Simulation Environment Section */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sliders className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Simulation Engine
            </h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Engine Mode:</span>
              <span className="font-mono text-foreground">Deterministic Client-Side</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Event Log Buffer:</span>
              <span className="font-mono text-foreground">200 events</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">AI Assistance Layer:</span>
              <span className="font-mono text-muted-foreground">Off (Phase 12)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
