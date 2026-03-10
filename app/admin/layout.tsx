import { AppShell } from "@/components/portal/app-shell";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { t } from "@/lib/i18n/dictionaries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("admin");
  const locale = await resolveLocaleForUser(profile);

  return (
    <AppShell
      locale={locale}
      title="Admin Portal"
      links={[
        { href: "/admin/clients", label: t(locale, "clients") },
        { href: "/admin/report-types", label: t(locale, "reportTypes") },
        { href: "/admin/client-reports", label: "Client Reports" },
        { href: "/admin/master-data", label: "Master Data" },
        { href: "/admin/reports", label: t(locale, "reports") },
      ]}
    >
      {children}
    </AppShell>
  );
}
