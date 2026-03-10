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
      className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm ${isPending ? "opacity-80" : ""}`}
    >
      <select
        className="h-10 min-w-20 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-blue-400 focus:bg-white disabled:cursor-wait"
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
      {isPending ? <span className="text-xs font-medium text-slate-500">Saving...</span> : null}
    </div>
  );
}
