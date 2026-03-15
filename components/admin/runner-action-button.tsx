"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type RunnerActionButtonProps = {
  endpoint: string;
  label: string;
  payload: Record<string, string>;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  variant?: "default" | "secondary";
  size?: "sm" | "default";
  confirmMessage?: string;
};

export function RunnerActionButton({
  endpoint,
  label,
  payload,
  disabled = false,
  disabledReason,
  className,
  variant = "default",
  size = "sm",
  confirmMessage,
}: RunnerActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const isDisabled = disabled || loading;

  async function run() {
    if (isDisabled) return;
    if (confirmMessage) {
      const ok = window.confirm(confirmMessage);
      if (!ok) return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            error?: string;
          }
        | null;
      if (!response.ok) {
        setMessage(body?.error ?? "Runner failed.");
        return;
      }
      setMessage(body?.message ?? "Runner triggered.");
    } catch {
      setMessage("Runner failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={run}
        disabled={isDisabled}
        title={disabled ? disabledReason : undefined}
      >
        {loading ? "Running..." : label}
      </Button>
      {disabled && disabledReason ? <p className="text-[11px] text-muted-foreground">{disabledReason}</p> : null}
      {message ? <p className="text-[11px] text-muted-foreground">{message}</p> : null}
    </div>
  );
}
