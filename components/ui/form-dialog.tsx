"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type FormDialogProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  children: React.ReactNode;
};

export function FormDialog({
  title,
  description,
  triggerLabel,
  triggerVariant = "secondary",
  triggerSize = "sm",
  children,
}: FormDialogProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <Button type="button" variant={triggerVariant} size={triggerSize} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-panel">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold">{title}</h3>
                {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
