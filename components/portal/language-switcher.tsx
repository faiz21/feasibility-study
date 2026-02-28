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
    <select
      className="rounded border px-2 py-1 text-sm"
      value={value}
      disabled={isPending}
      onChange={(e) => updateLocale(e.target.value)}
    >
      {LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
