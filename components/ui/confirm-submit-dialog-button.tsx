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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-panel">
            <h3 className="text-base font-semibold">{confirmTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{confirmDescription}</p>
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
