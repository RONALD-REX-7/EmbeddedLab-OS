/**
 * EmbeddedLab OS — app/layout.tsx
 * Root layout. Applies fonts, metadata, and dark theme.
 * All routes share this root.
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/supabase/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EmbeddedLab OS",
    template: "%s — EmbeddedLab OS",
  },
  description:
    "Interactive virtual embedded-systems laboratory. Learn GPIO, PWM, ADC, and UART through guided experiments — no hardware required.",
  keywords: [
    "embedded systems",
    "virtual lab",
    "GPIO",
    "PWM",
    "ADC",
    "UART",
    "microcontroller",
    "educational",
    "simulation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased bg-background text-foreground transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <TooltipProvider delay={300}>{children}</TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
