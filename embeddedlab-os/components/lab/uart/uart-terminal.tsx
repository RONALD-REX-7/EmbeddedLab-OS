/**
 * EmbeddedLab OS — components/lab/uart/uart-terminal.tsx
 * Serial TX/RX Terminal Console — engineering scope-style terminal.
 */
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UARTTerminalProps {
  title: string;
  subtitle?: string;
  buffer: string[];
  type: "TX" | "RX";
  compatible?: boolean;
  className?: string;
}

export function UARTTerminal({
  title,
  subtitle,
  buffer,
  type,
  compatible = true,
  className,
}: UARTTerminalProps) {
  return (
    <div
      className={cn(
        "rounded border border-[var(--border-default)] bg-[var(--surface-console)] flex flex-col overflow-hidden font-mono text-xs",
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--surface-panel)] select-none">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            type === "TX" ? "bg-sky-400 shadow-[0_0_4px_rgba(56,189,248,0.7)]" : "bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.7)]"
          )} />
          <Terminal className={cn("h-3 w-3", type === "TX" ? "text-sky-400" : "text-emerald-400")} />
          <span className="font-bold text-foreground text-[10px] uppercase tracking-wider">
            {title}
          </span>
          {subtitle && (
            <span className="text-[9px] text-muted-foreground/70">{subtitle}</span>
          )}
        </div>
        <span className="text-[9px] text-muted-foreground font-bold">
          {buffer.length} msg
        </span>
      </div>

      {/* Terminal Buffer */}
      <ScrollArea className="p-2.5 h-36">
        {buffer.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground/50 text-[10px] font-mono">
            {type === "TX"
              ? "TX buffer idle. Send data below."
              : "RX buffer idle. Awaiting data."}
          </div>
        ) : (
          <div className="space-y-0.5 text-[10px] leading-relaxed">
            {buffer.map((msg, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span
                  className={cn(
                    "font-bold shrink-0 select-none text-[9px]",
                    type === "TX" ? "text-sky-400" : compatible ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {type}&gt;
                </span>
                <span
                  className={cn(
                    "break-all",
                    !compatible && type === "RX"
                      ? "text-red-400 line-through opacity-60"
                      : "text-foreground"
                  )}
                >
                  {msg}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
