import Link from "next/link";
import { Cpu, FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <FileQuestion className="h-6 w-6 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        The requested resource or laboratory route does not exist within the EmbeddedLab OS workspace.
      </p>
      <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
        <Cpu className="mr-2 h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
