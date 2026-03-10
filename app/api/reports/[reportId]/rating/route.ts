import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await context.params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rating: number; comment?: string | null; reportPageId?: string };
  const reportPageId = body.reportPageId;

  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "Rating must be 1..5" }, { status: 400 });
  }

  if (!reportPageId) {
    return NextResponse.json({ error: "reportPageId is required" }, { status: 400 });
  }

  const { data: reportPage, error: reportPageError } = await supabase
    .from("report_pages")
    .select("id")
    .eq("id", reportPageId)
    .eq("report_id", reportId)
    .maybeSingle();

  if (reportPageError) {
    return NextResponse.json({ error: reportPageError.message }, { status: 400 });
  }

  if (!reportPage) {
    return NextResponse.json({ error: "Invalid reportPageId for this report" }, { status: 400 });
  }

  const { error } = await supabase.from("report_ratings").upsert(
    {
      report_id: reportId,
      report_page_id: reportPageId,
      user_id: userData.user.id,
      rating: body.rating,
      comment: body.comment ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "report_id,report_page_id,user_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, reportPageId });
}
