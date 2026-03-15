import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ reportTypeId: string; pageId: string }> },
) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportTypeId, pageId } = await context.params;

  const { data } = await supabase
    .from("report_page_templates")
    .select("id,report_type_template_id,html_template")
    .eq("id", pageId)
    .eq("report_type_template_id", reportTypeId)
    .maybeSingle();

  if (!data) {
    return new NextResponse("<h1>Template not found.</h1>", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (!data.html_template) {
    return new NextResponse("<h1>Preview requires an HTML template.</h1>", {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const normalized = ensureBaseHref(data.html_template, "/");

  return new NextResponse(normalized, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
