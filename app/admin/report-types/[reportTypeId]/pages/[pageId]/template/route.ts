import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

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

  if (!data?.html_template) {
    return new NextResponse("Template not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new NextResponse(data.html_template, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "inline; filename=\"template.html\"",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

