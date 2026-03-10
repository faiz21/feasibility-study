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
    .select("id,report_type_template_id,sample_data")
    .eq("id", pageId)
    .eq("report_type_template_id", reportTypeId)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  if (!data.sample_data) {
    return NextResponse.json({ error: "No sample data" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new NextResponse(JSON.stringify(data.sample_data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

