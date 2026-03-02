import { createClient } from "@/lib/supabase/server";
import { requireRole, resolveLocaleForUser } from "@/lib/portal/auth";
import { logAccess } from "@/lib/portal/logging";
import { renderTemplate } from "@/lib/portal/template";
import { ReportViewer } from "@/components/portal/report-viewer";
import { resolveClientTheme, type ClientThemeColors } from "@/lib/client-theme";

function buildThemeTokens(colors: ClientThemeColors) {
  const cssVars: Record<string, string> = {};
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--client-${key}`] = value;
  });
  cssVars["--client-text"] = colors.foreground;
  return cssVars;
}

function toCssVarBlock(tokens: Record<string, string>) {
  return Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
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
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
        No access to this report.
      </div>
    );
  }

  const [{ data: pages }, { data: clientRow }] = await Promise.all([
    supabase
      .from("report_pages")
      .select(
        "id,page_order,en_content,id_content,ja_content,report_page_templates(page_key,html_template),report_page_translations(locale,title)",
      )
      .eq("report_id", reportId)
      .order("page_order", { ascending: true }),
    supabase
      .from("clients")
      .select(
        "id,name,code,domain,default_locale,logo_url,color_palette,theme_tokens",
      )
      .eq("id", profile.client_id)
      .maybeSingle(),
  ]);

  const [{ data: resumeRow }, { data: ratingRow }] = isAdminPreview
    ? [{ data: null }, { data: null }]
    : await Promise.all([
        supabase
          .from("report_resume")
          .select("last_page_id,last_scroll_y")
          .eq("report_id", reportId)
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("report_ratings")
          .select("rating,comment")
          .eq("report_id", reportId)
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

  const theme = resolveClientTheme(clientRow?.theme_tokens, clientRow?.color_palette);
  const themeTokens = buildThemeTokens(theme.colors);
  const brandingPayload = {
    client: {
      id: clientRow?.id ?? profile.client_id,
      name: clientRow?.name ?? "",
      code: clientRow?.code ?? "",
      domain: clientRow?.domain ?? "",
      default_locale: clientRow?.default_locale ?? locale,
      logo_url: clientRow?.logo_url ?? "",
      color_palette: theme.palette,
      theme_tokens: clientRow?.theme_tokens ?? null,
    },
    theme: theme.palette,
    theme_tokens: clientRow?.theme_tokens ?? null,
    theme_css_vars: toCssVarBlock(themeTokens),
    branding: {
      logo_url: clientRow?.logo_url ?? "",
      ...theme.palette,
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
      | { page_key?: string; html_template?: string }[]
      | { page_key?: string; html_template?: string }
      | null;
    const htmlTemplate = Array.isArray(templateRow)
      ? templateRow[0]?.html_template
      : templateRow?.html_template;
    const pageCode = Array.isArray(templateRow)
      ? templateRow[0]?.page_key
      : templateRow?.page_key;

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
      code: pageCode ?? `P${page.page_order}`,
      html: renderTemplate(htmlTemplate ?? "", payload),
    };
  });

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
      initialResume={{
        lastPageId: resumeRow?.last_page_id ?? null,
        lastScrollY: resumeRow?.last_scroll_y ?? null,
      }}
      initialRating={{
        rating: ratingRow?.rating ?? 5,
        comment: ratingRow?.comment ?? "",
        hasExisting: Boolean(ratingRow),
      }}
      previewMode={isAdminPreview}
    />
  );
}
