/**
 * EmbeddedLab OS — app/(app)/layout.tsx
 * Authenticated app shell layout.
 * Renders the sidebar + topbar + main content area.
 */
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — fixed left column */}
      <Sidebar />

      {/* Main content — takes remaining width */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <Topbar />

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
