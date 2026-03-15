"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type ConfirmSubmitDialogButtonProps = ButtonProps & {
  confirmTitle?: string;
  confirmDescription: string;
  cancelText?: string;
  confirmText?: string;
};

export function ConfirmSubmitDialogButton({
  confirmTitle = "Confirm action",
  confirmDescription,
  cancelText = "Cancel",
  confirmText = "Confirm",
  children,
  ...props
}: ConfirmSubmitDialogButtonProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen(true)}
        {...props}
      >
        {children}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/40 p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-[1.4rem] border border-border/80 bg-card/95 p-6 shadow-panel">
            <h3 className="text-xl font-semibold tracking-tight">{confirmTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{confirmDescription}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                {cancelText}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const form = triggerRef.current?.form;
                  setOpen(false);
                  form?.requestSubmit();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
