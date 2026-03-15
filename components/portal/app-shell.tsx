"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/portal/language-switcher";
import type { Locale } from "@/lib/i18n/dictionaries";
import { BrandLogo } from "@/components/brand-logo";
import { NavLink } from "@/components/portal/nav-link";
import type { ReportsUiTheme } from "@/lib/report-view-theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppShell({
  locale,
  links,
  title,
  reportTheme,
  contentWidth = "default",
  children,
}: {
  locale: Locale;
  links: Array<{ href: string; label: string }>;
  title: string;
  reportTheme?: ReportsUiTheme;
  contentWidth?: "default" | "wide";
  children: React.ReactNode;
}) {
  const theme = reportTheme;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLink = useMemo(
    () => links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)),
    [links, pathname],
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const shellStyles = theme
    ? {
        background: theme.surface,
        color: theme.textPrimary,
      }
    : undefined;

  const sidebarStyles = theme
    ? {
        background: theme.surfaceSidebar,
        borderColor: theme.borderStrong,
      }
    : undefined;

  const headerStyles = theme
    ? {
        borderColor: theme.borderStrong,
        background: `linear-gradient(180deg, ${theme.surfaceElevated}, ${theme.surface})`,
      }
    : undefined;

  const contentStyles = theme
    ? {
        background: `linear-gradient(180deg, ${theme.surface} 0%, ${theme.surfaceMuted} 100%)`,
      }
    : undefined;
  const containerWidthClass =
    contentWidth === "wide" ? "max-w-[1600px] 2xl:max-w-[1720px]" : "max-w-7xl";

  return (
    <main className="min-h-screen bg-background" style={shellStyles}>
      <div className="lg:flex">
        <aside
          className="fixed inset-y-0 left-0 z-40 hidden w-72 shrink-0 border-r border-nav-border/80 bg-nav text-nav-foreground lg:flex lg:flex-col"
          style={sidebarStyles}
        >
          <div className="border-b border-nav-border/80 px-6 py-6">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="compact" className="brightness-0 invert" />
              <div className="space-y-1">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-nav-foreground/70">
                  Machine Vision
                </p>
                <p className="text-lg font-semibold text-white">{title}</p>
              </div>
            </Link>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
            <div className="rounded-[1.4rem] border border-nav-border/80 bg-white/5 p-4 text-sm text-nav-foreground/80">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-nav-foreground/70">
                Current Workspace
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{activeLink?.label ?? title}</p>
            </div>
            <nav className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  variant="sidebar"
                  activeColor="hsl(var(--nav-active-foreground))"
                  activeBackground="hsl(var(--nav-active))"
                  inactiveColor="hsl(var(--nav-foreground))"
                  hoverBackground="hsl(var(--nav-hover))"
                  hoverColor="#ffffff"
                  className="block"
                />
              ))}
            </nav>
          </div>
          <div className="border-t border-nav-border/80 px-4 py-4">
            <div className="rounded-[1.35rem] border border-nav-border/80 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <ThemeSwitcher />
                <LogoutButton className="flex-1" />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:ml-72">
          <header
            className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-xl"
            style={headerStyles}
          >
            <div className={cn("mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-6", containerWidthClass)}>
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {title}
                  </p>
                  <h1 className="truncate font-sans text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {activeLink?.label ?? title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher value={locale} />
                <LogoutButton className="hidden md:inline-flex" />
              </div>
            </div>
          </header>

          <section className="min-h-[calc(100dvh-81px)]" style={contentStyles}>
            <div className={cn("mx-auto px-4 py-6 pb-12 md:px-6 lg:px-8", containerWidthClass)}>
              {children}
            </div>
          </section>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-overlay/45 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={cn(
            "h-full w-[88vw] max-w-sm border-r border-nav-border/80 bg-nav p-4 text-nav-foreground shadow-shell transition-transform duration-200 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          style={sidebarStyles}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 border-b border-nav-border/80 pb-4">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="compact" className="brightness-0 invert" />
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-nav-foreground/70">
                  Machine Vision
                </p>
                <p className="text-lg font-semibold text-white">{title}</p>
              </div>
            </Link>
            <Button type="button" variant="ghost" size="icon" className="text-white" onClick={() => setMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                variant="sidebar"
                activeColor="hsl(var(--nav-active-foreground))"
                activeBackground="hsl(var(--nav-active))"
                inactiveColor="hsl(var(--nav-foreground))"
                hoverBackground="hsl(var(--nav-hover))"
                hoverColor="#ffffff"
                className="block"
              />
            ))}
          </nav>
          <div className="mt-6 space-y-3 rounded-[1.4rem] border border-nav-border/80 bg-white/5 p-4">
            <ThemeSwitcher />
            <LanguageSwitcher value={locale} />
            <LogoutButton className="w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
