"use client";

import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <StatusBanner tone="critical">
        <div>
          <p className="font-medium">Failed to load reports.</p>
          <p className="mt-1 text-muted-foreground">{error.message || "Unexpected error occurred."}</p>
        </div>
      </StatusBanner>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
