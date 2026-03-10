import { AppShell } from "@/components/portal/app-shell";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { t } from "@/lib/i18n/dictionaries";
import { resolveReportsUiTheme } from "@/lib/report-view-theme";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, isAdminPreview } = await requireRole("client");
  const locale = await resolveLocaleForUser(profile);

  const reportTheme = resolveReportsUiTheme();

  return (
    <AppShell
      locale={locale}
      title={isAdminPreview ? "Client Preview" : "Client Portal"}
      reportTheme={reportTheme}
      links={[
        { href: "/reports", label: t(locale, "reports") },
        ...(isAdminPreview ? [{ href: "/admin/reports", label: t(locale, "admin") }] : []),
      ]}
    >
      {children}
    </AppShell>
  );
}
