/**
 * EmbeddedLab OS — components/shared/logo.tsx
 * Wordmark used in the sidebar and landing page.
 */
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show the icon */
  showIcon?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { icon: "h-3.5 w-3.5", text: "text-sm", gap: "gap-1.5" },
  md: { icon: "h-4 w-4",   text: "text-base", gap: "gap-2" },
  lg: { icon: "h-5 w-5",   text: "text-xl",   gap: "gap-2.5" },
};

export function Logo({ size = "md", showIcon = true, className }: LogoProps) {
  const s = sizeStyles[size];
  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {showIcon && (
        <Cpu
          className={cn(s.icon, "text-primary shrink-0")}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      )}
      <span className={cn("font-semibold tracking-tight leading-none", s.text)}>
        <span className="text-foreground">EmbeddedLab</span>
        <span className="text-primary ml-0.5">OS</span>
      </span>
    </div>
  );
}
