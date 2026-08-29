/**
 * EmbeddedLab OS — components/lab/uart/uart-terminal.tsx
 * Interactive TX / RX Terminal console display.
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
        "rounded-md border border-border bg-black/60 flex flex-col overflow-hidden font-mono text-xs",
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/60 select-none">
        <div className="flex items-center gap-2">
          <Terminal className={cn("h-4 w-4", type === "TX" ? "text-primary" : "text-[var(--signal-high)]")} />
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] text-muted-foreground">({subtitle})</span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {buffer.length} messages
        </span>
      </div>

      {/* Terminal Buffer Window */}
      <ScrollArea className="p-3 h-40">
        {buffer.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground/60 text-xs font-sans">
            {type === "TX"
              ? "TX buffer empty. Type a message below and click Send."
              : "RX buffer empty. Transmitted messages will appear here when compatible."}
          </div>
        ) : (
          <div className="space-y-1 text-[11px] leading-relaxed">
            {buffer.map((msg, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={cn(
                    "font-bold shrink-0 select-none",
                    type === "TX" ? "text-primary" : compatible ? "text-[var(--signal-high)]" : "text-[var(--feedback-error)]"
                  )}
                >
                  [{type}]:
                </span>
                <span
                  className={cn(
                    "break-all",
                    !compatible && type === "RX"
                      ? "text-[var(--feedback-error)] italic"
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
