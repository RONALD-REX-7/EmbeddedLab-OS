/**
 * EmbeddedLab OS — app/(app)/layout.tsx
 * Authenticated engineering workstation shell layout.
 * Employs a panoramic top instrument ribbon (AppNavbar) maximizing horizontal canvas area.
 */
import { AppNavbar } from "@/components/layout/app-navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-primary focus:text-primary-foreground focus:rounded focus:font-mono focus:text-xs focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Panoramic Instrument Ribbon Top Navigation */}
      <AppNavbar />

      {/* Main scrollable laboratory workstation surface */}
      <main
        className="flex-1 overflow-y-auto min-w-0 focus:outline-none"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}
