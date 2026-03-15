"use client";

import { useTransition } from "react";
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher({
  value,
}: {
  value: Locale;
}) {
  const [isPending, startTransition] = useTransition();

  const updateLocale = (locale: string) => {
    startTransition(async () => {
      await fetch("/api/profile/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      window.location.reload();
    });
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-border/80 bg-card/85 px-2 py-1 shadow-soft ${isPending ? "opacity-80" : ""}`}
    >
      <select
        className="h-11 min-w-24 rounded-xl border border-input bg-card/90 px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary-border focus:bg-card disabled:cursor-wait"
        value={value}
        disabled={isPending}
        onChange={(e) => updateLocale(e.target.value)}
        aria-label="Select locale"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
      {isPending ? <span className="text-xs font-medium text-muted-foreground">Saving...</span> : null}
    </div>
  );
}
