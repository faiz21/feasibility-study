import { AppShell } from "@/components/portal/app-shell";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { t } from "@/lib/i18n/dictionaries";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("client");
  const locale = await resolveLocaleForUser(profile);

  return (
    <AppShell
      locale={locale}
      title="Client Portal"
      links={[{ href: "/reports", label: t(locale, "reports") }]}
    >
      {children}
    </AppShell>
  );
}
