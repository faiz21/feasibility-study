import { AppShell } from "@/components/portal/app-shell";
import { createClient } from "@/lib/supabase/server";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { t } from "@/lib/i18n/dictionaries";
import { resolveClientTheme } from "@/lib/client-theme";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, isAdminPreview } = await requireRole("client");
  const locale = await resolveLocaleForUser(profile);
  const supabase = await createClient();

  const { data: clientRow } = await supabase
    .from("clients")
    .select("color_palette,theme_tokens")
    .eq("id", profile.client_id)
    .maybeSingle();

  const { palette } = resolveClientTheme(clientRow?.theme_tokens, clientRow?.color_palette);

  return (
    <AppShell
      locale={locale}
      title={isAdminPreview ? "Client Preview" : "Client Portal"}
      palette={palette}
      links={[
        { href: "/reports", label: t(locale, "reports") },
        ...(isAdminPreview ? [{ href: "/admin/reports", label: t(locale, "admin") }] : []),
      ]}
    >
      {children}
    </AppShell>
  );
}
