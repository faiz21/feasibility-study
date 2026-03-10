import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { renderTemplate } from "@/lib/portal/template";

export const dynamic = "force-dynamic";

function ensureBaseHref(template: string, href: string): string {
  if (/<base\b/i.test(template)) return template;
  const baseTag = `<base href="${href}">`;

  if (/<head\b[^>]*>/i.test(template)) {
    return template.replace(/<head\b[^>]*>/i, (match) => `${match}\n${baseTag}`);
  }

  if (/<html\b[^>]*>/i.test(template)) {
    return template.replace(/<html\b[^>]*>/i, (match) => `${match}\n<head>${baseTag}</head>`);
  }

  return `${baseTag}\n${template}`;
}

function injectReportDataScript(template: string, sample: unknown): string {
  const hasReportDataScript = /<script[^>]*id=["']report-data["'][^>]*>/i.test(template);
  if (!hasReportDataScript) return template;
  const payload = JSON.stringify(sample ?? {}, null, 2).replace(/<\/script/gi, "<\\/script");
  return template.replace(
    /(<script[^>]*id=["']report-data["'][^>]*>)([\s\S]*?)(<\/script>)/i,
    `$1\n${payload}\n$3`,
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ reportTypeId: string; pageId: string }> },
) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportTypeId, pageId } = await context.params;

  const { data } = await supabase
    .from("report_page_templates")
    .select("id,report_type_template_id,html_template,sample_data")
    .eq("id", pageId)
    .eq("report_type_template_id", reportTypeId)
    .maybeSingle();

  if (!data) {
    return new NextResponse("<h1>Template not found.</h1>", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (!data.html_template || !data.sample_data) {
    return new NextResponse("<h1>Preview requires both HTML template and sample JSON.</h1>", {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const normalized = ensureBaseHref(data.html_template, "/");
  const rendered = renderTemplate(normalized, data.sample_data);
  const withReportData = injectReportDataScript(rendered, data.sample_data);

  return new NextResponse(withReportData, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
