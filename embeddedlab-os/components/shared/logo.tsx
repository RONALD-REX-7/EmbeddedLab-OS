/**
 * EmbeddedLab OS — components/shared/logo.tsx
 * Precision microcontroller brandmark with IC package icon.
 */
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { icon: "h-4 w-4", text: "text-sm", gap: "gap-2" },
  md: { icon: "h-5 w-5", text: "text-base", gap: "gap-2.5" },
  lg: { icon: "h-6 w-6", text: "text-xl", gap: "gap-3" },
};

export function Logo({ size = "md", showIcon = true, className }: LogoProps) {
  const s = sizeStyles[size];
  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      {showIcon && (
        <div className={cn("relative shrink-0 flex items-center justify-center", s.icon)}>
          {/* Custom SVG Silicon Microcontroller Chip Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-primary"
          >
            {/* Silicon IC Body */}
            <rect x="4" y="4" width="16" height="16" rx="2" className="fill-primary/10 stroke-primary" />
            {/* Core Die */}
            <rect x="8" y="8" width="8" height="8" rx="1" className="fill-primary/20 stroke-primary/80" />
            {/* Pin 1 Index Dot */}
            <circle cx="6" cy="6" r="0.75" className="fill-primary stroke-none" />
            {/* North/South Pins */}
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3" className="stroke-primary/70" />
            {/* West/East Pins */}
            <path d="M1 9h3M1 15h3M20 9h3M20 15h3" className="stroke-primary/70" />
          </svg>
        </div>
      )}
      <span className={cn("font-bold tracking-tight leading-none flex items-center", s.text)}>
        <span className="text-foreground font-sans">EmbeddedLab</span>
        <span className="text-primary font-mono ml-1 font-extrabold text-[0.85em] px-1 py-0.5 rounded bg-primary/10 border border-primary/20">
          OS
        </span>
      </span>
    </div>
  );
}
