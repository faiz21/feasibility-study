import { createClient } from "@/lib/supabase/server";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { logAccess } from "@/lib/portal/logging";
import { renderTemplate } from "@/lib/portal/template";
import { ReportViewer } from "@/components/portal/report-viewer";

type ClientPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

const DEFAULT_CLIENT_PALETTE: ClientPalette = {
  primary: "#0f172a",
  secondary: "#334155",
  accent: "#0ea5e9",
  background: "#ffffff",
  text: "#0f172a",
};

function normalizePalette(input: unknown): ClientPalette {
  if (!input || typeof input !== "object" || Array.isArray(input)) return DEFAULT_CLIENT_PALETTE;
  const value = input as Record<string, unknown>;
  return {
    primary: typeof value.primary === "string" ? value.primary : DEFAULT_CLIENT_PALETTE.primary,
    secondary: typeof value.secondary === "string" ? value.secondary : DEFAULT_CLIENT_PALETTE.secondary,
    accent: typeof value.accent === "string" ? value.accent : DEFAULT_CLIENT_PALETTE.accent,
    background: typeof value.background === "string" ? value.background : DEFAULT_CLIENT_PALETTE.background,
    text: typeof value.text === "string" ? value.text : DEFAULT_CLIENT_PALETTE.text,
  };
}

function attachBranding(content: unknown, branding: Record<string, unknown>) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return { ...(content as Record<string, unknown>), ...branding };
  }
  return { content, ...branding };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const { profile, user } = await requireRole("client");
  const locale = await resolveLocaleForUser(profile);
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("client_reports")
    .select("report_id")
    .eq("client_id", profile.client_id)
    .eq("report_id", reportId)
    .maybeSingle();

  if (!assignment) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
        No access to this report.
      </div>
    );
  }

  const [{ data: pages }, { data: clientRow }] = await Promise.all([
    supabase
      .from("report_pages")
      .select(
        "id,page_order,en_content,id_content,ja_content,report_page_templates(html_template),report_page_translations(locale,title)",
      )
      .eq("report_id", reportId)
      .order("page_order", { ascending: true }),
    supabase
      .from("clients")
      .select("id,name,code,domain,default_locale,logo_url,color_palette")
      .eq("id", profile.client_id)
      .maybeSingle(),
  ]);

  const palette = normalizePalette(clientRow?.color_palette);
  const brandingPayload = {
    client: {
      id: clientRow?.id ?? profile.client_id,
      name: clientRow?.name ?? "",
      code: clientRow?.code ?? "",
      domain: clientRow?.domain ?? "",
      default_locale: clientRow?.default_locale ?? locale,
      logo_url: clientRow?.logo_url ?? "",
      color_palette: palette,
    },
    theme: palette,
    branding: {
      logo_url: clientRow?.logo_url ?? "",
      ...palette,
    },
  };

  const resolved = (pages ?? []).map((page) => {
    const content =
      locale === "id"
        ? (page.id_content ?? page.en_content)
        : locale === "ja"
          ? (page.ja_content ?? page.en_content)
          : page.en_content;

    const templateRow = page.report_page_templates as
      | { html_template?: string }[]
      | { html_template?: string }
      | null;
    const htmlTemplate = Array.isArray(templateRow)
      ? templateRow[0]?.html_template
      : templateRow?.html_template;

    const titleRow = (Array.isArray(page.report_page_translations)
      ? page.report_page_translations
      : [])
      .find((row) => row.locale === locale) ??
      (Array.isArray(page.report_page_translations)
        ? page.report_page_translations.find((row) => row.locale === "en")
        : undefined);

    const payload = attachBranding(content, brandingPayload);

    return {
      id: page.id,
      page_order: page.page_order,
      title: titleRow?.title ?? `Page ${page.page_order}`,
      html: renderTemplate(htmlTemplate ?? "", payload),
    };
  });

  await supabase.from("report_resume").upsert(
    {
      report_id: reportId,
      user_id: user.id,
      last_locale: locale,
    },
    { onConflict: "report_id,user_id" },
  );

  await logAccess({
    userId: user.id,
    email: user.email,
    roleText: profile.role,
    clientId: profile.client_id,
    reportId,
    action: "report_open",
    metadata: { locale },
  });

  return <ReportViewer reportId={reportId} locale={locale} pages={resolved} />;
}
