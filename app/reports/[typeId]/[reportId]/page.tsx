import { createClient } from "@/lib/supabase/server";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { logAccess } from "@/lib/portal/logging";
import { renderTemplate } from "@/lib/portal/template";
import { ReportViewer } from "@/components/portal/report-viewer";
import { resolveReportsUiTheme } from "@/lib/report-view-theme";
import { StatusBanner } from "@/components/ui/status-banner";

function attachBranding(content: unknown, branding: Record<string, unknown>) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return { ...(content as Record<string, unknown>), ...branding };
  }
  return { content, ...branding };
}

function injectReportDataScript(template: string, sample: unknown): string {
  const hasReportDataScript = /<script[^>]*id=["']report-data["'][^>]*>/i.test(template);
  if (!hasReportDataScript) return template;
  const payload = JSON.stringify(sample ?? {}, null, 2);
  return template.replace(
    /(<script[^>]*id=["']report-data["'][^>]*>)([\s\S]*?)(<\/script>)/i,
    `$1\n${payload}\n$3`,
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const { profile, user, isAdminPreview } = await requireRole("client");
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
      <StatusBanner tone="warning">No access to this report.</StatusBanner>
    );
  }

  const [{ data: pages }, { data: clientRow }] = await Promise.all([
    supabase
      .from("report_pages")
      .select(
        "id,page_order,en_content,id_content,ja_content,report_page_templates(page_key,title,html_template),report_page_translations(locale,title)",
      )
      .eq("report_id", reportId)
      .order("page_order", { ascending: true }),
    supabase
      .from("clients")
      .select(
        "id,name,code,domain,default_locale,logo_url",
      )
      .eq("id", profile.client_id)
      .maybeSingle(),
  ]);

  const [{ data: ratingRows }] = isAdminPreview
    ? [{ data: [] as Array<{ report_page_id: string | null; rating: number; comment: string | null }> }]
    : await Promise.all([
        supabase
          .from("report_ratings")
          .select("report_page_id,rating,comment")
          .eq("report_id", reportId)
          .eq("user_id", user.id)
          .not("report_page_id", "is", null),
      ]);

  const reportsUiTheme = resolveReportsUiTheme();
  const brandingPayload = {
    client: {
      id: clientRow?.id ?? profile.client_id,
      name: clientRow?.name ?? "",
      code: clientRow?.code ?? "",
      domain: clientRow?.domain ?? "",
      default_locale: clientRow?.default_locale ?? locale,
      logo_url: clientRow?.logo_url ?? "",
      color_palette: {
        primary: reportsUiTheme.accent,
        secondary: reportsUiTheme.textSecondary,
        accent: reportsUiTheme.info,
        background: reportsUiTheme.surface,
        text: reportsUiTheme.textPrimary,
      },
      theme_tokens: null,
    },
    theme: {
      primary: reportsUiTheme.accent,
      secondary: reportsUiTheme.textSecondary,
      accent: reportsUiTheme.info,
      background: reportsUiTheme.surface,
      text: reportsUiTheme.textPrimary,
    },
    theme_tokens: null,
    theme_css_vars: "",
    branding: {
      logo_url: clientRow?.logo_url ?? "",
      primary: reportsUiTheme.accent,
      secondary: reportsUiTheme.textSecondary,
      accent: reportsUiTheme.info,
      background: reportsUiTheme.surface,
      text: reportsUiTheme.textPrimary,
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
      | { page_key?: string; title?: string; html_template?: string }[]
      | { page_key?: string; title?: string; html_template?: string }
      | null;
    const htmlTemplate = Array.isArray(templateRow)
      ? templateRow[0]?.html_template
      : templateRow?.html_template;
    const pageCode = Array.isArray(templateRow)
      ? templateRow[0]?.page_key
      : templateRow?.page_key;
    const templateTitle = Array.isArray(templateRow)
      ? templateRow[0]?.title
      : templateRow?.title;

    const titleRow = (Array.isArray(page.report_page_translations)
      ? page.report_page_translations
      : [])
      .find((row) => row.locale === locale) ??
      (Array.isArray(page.report_page_translations)
        ? page.report_page_translations.find((row) => row.locale === "en")
        : undefined);

    const payload = attachBranding(content, brandingPayload);
    const templateForRender = injectReportDataScript(htmlTemplate ?? "", payload);

    return {
      id: page.id,
      page_order: page.page_order,
      title: titleRow?.title ?? templateTitle ?? pageCode ?? `Page ${page.page_order}`,
      code: pageCode ?? `P${page.page_order}`,
      html: renderTemplate(templateForRender, payload),
    };
  });

  const initialRatingsByPageId = Object.fromEntries(
    (ratingRows ?? [])
      .filter((row) => Boolean(row.report_page_id))
      .map((row) => [
        row.report_page_id as string,
        {
          rating: row.rating ?? 5,
          comment: row.comment ?? "",
          hasExisting: true,
        },
      ]),
  ) as Record<string, { rating: number; comment: string; hasExisting: boolean }>;

  if (!isAdminPreview) {
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
  }

  return (
    <ReportViewer
      reportId={reportId}
      locale={locale}
      pages={resolved}
      initialRatingsByPageId={initialRatingsByPageId}
      previewMode={isAdminPreview}
      reportTheme={reportsUiTheme}
    />
  );
}
