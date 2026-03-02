import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/portal/language-switcher";
import type { Locale } from "@/lib/i18n/dictionaries";
import { BrandLogo } from "@/components/brand-logo";
import { NavLink } from "@/components/portal/nav-link";

export function AppShell({
  locale,
  links,
  title,
  palette,
  children,
}: {
  locale: Locale;
  links: Array<{ href: string; label: string }>;
  title: string;
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen bg-background"
      style={
        palette
          ? {
              background: `linear-gradient(180deg, ${palette.background}, ${palette.background})`,
              color: palette.text,
            }
          : undefined
      }
    >
      <header
        className="border-b border-border/70 bg-card/90 backdrop-blur"
        style={
          palette
            ? {
                borderColor: `${palette.primary}33`,
                background: `linear-gradient(90deg, ${palette.primary}11, ${palette.secondary}0D)`,
              }
            : undefined
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="compact" />
              <h1 className="text-lg font-semibold" style={palette ? { color: palette.primary } : undefined}>
                {title}
              </h1>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher value={locale} />
            <LogoutButton />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl p-4">{children}</section>
    </main>
  );
}
