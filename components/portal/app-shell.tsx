import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/portal/language-switcher";
import type { Locale } from "@/lib/i18n/dictionaries";
import { BrandLogo } from "@/components/brand-logo";
import { NavLink } from "@/components/portal/nav-link";
import type { ReportsUiTheme } from "@/lib/report-view-theme";

export function AppShell({
  locale,
  links,
  title,
  reportTheme,
  children,
}: {
  locale: Locale;
  links: Array<{ href: string; label: string }>;
  title: string;
  reportTheme?: ReportsUiTheme;
  children: React.ReactNode;
}) {
  const theme = reportTheme;
  return (
    <main
      className="min-h-screen overflow-y-auto bg-background"
      style={
        theme
          ? {
              background: theme.surface,
              color: theme.textPrimary,
            }
          : undefined
      }
    >
      <header
        className="sticky top-0 z-50 border-b border-border/70 bg-card/90 backdrop-blur"
        style={
          theme
            ? {
                borderColor: theme.borderStrong,
                background: `linear-gradient(90deg, ${theme.surfaceElevated}, ${theme.surfaceMuted})`,
              }
            : undefined
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="compact" />
              <h1 className="text-lg font-semibold" style={theme ? { color: theme.accent } : undefined}>
                {title}
              </h1>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  activeColor={theme?.accentContrast}
                  activeBackground={theme?.accent}
                  inactiveColor={theme?.textSecondary}
                  hoverBackground={theme?.accentSoft}
                  hoverColor={theme?.textPrimary}
                />
              ))}
            </nav>
          </div>
          <div
            className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-3 py-2 shadow-[0_6px_20px_-14px_rgba(15,23,42,0.45)]"
            style={
              theme
                ? {
                    borderColor: theme.borderStrong,
                    background: theme.surfaceElevated,
                  }
                : undefined
            }
          >
            <LanguageSwitcher value={locale} />
            <LogoutButton />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl p-4 pb-10">{children}</section>
    </main>
  );
}
