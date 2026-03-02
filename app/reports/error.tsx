"use client";

import { Button } from "@/components/ui/button";

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-critical/30 bg-critical/10 p-5">
      <p className="text-sm font-medium text-critical">Failed to load reports.</p>
      <p className="mt-1 text-sm text-muted-foreground">{error.message || "Unexpected error occurred."}</p>
      <Button className="mt-4" onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
