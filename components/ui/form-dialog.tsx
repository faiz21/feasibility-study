"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type FormDialogProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  fullScreen?: boolean;
  allowBrowserFullscreen?: boolean;
  children: React.ReactNode;
};

export function FormDialog({
  title,
  description,
  triggerLabel,
  triggerVariant = "secondary",
  triggerSize = "sm",
  fullScreen = false,
  allowBrowserFullscreen = false,
  children,
}: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsBrowserFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  React.useEffect(() => {
    if (open) return;
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement || document.fullscreenElement !== containerRef.current) return;
    if (!document.fullscreenEnabled || document.visibilityState !== "visible") return;
    try {
      void document.exitFullscreen().catch(() => undefined);
    } catch {
      // Ignore browser/fullscreen lifecycle races during dialog teardown.
    }
  }, [open]);

  const toggleBrowserFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement === containerRef.current) {
      try {
        await document.exitFullscreen();
      } catch {
        return;
      }
      return;
    }
    try {
      await containerRef.current.requestFullscreen();
    } catch {
      return;
    }
  };

  return (
    <>
      <Button type="button" variant={triggerVariant} size={triggerSize} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/40 p-4 backdrop-blur-md">
          <div
            ref={containerRef}
            className={
              fullScreen
                ? "glass-panel h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] rounded-[1.5rem] border border-border/80 bg-card/95 p-6 shadow-panel"
                : "glass-panel w-full max-w-3xl rounded-[1.5rem] border border-border/80 bg-card/95 p-6 shadow-panel"
            }
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                {allowBrowserFullscreen ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => void toggleBrowserFullscreen()}>
                    {isBrowserFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
