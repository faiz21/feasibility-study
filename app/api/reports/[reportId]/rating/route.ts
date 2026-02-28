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

  const body = (await request.json()) as { rating: number; comment?: string };

  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "Rating must be 1..5" }, { status: 400 });
  }

  const { error } = await supabase.from("report_ratings").upsert(
    {
      report_id: reportId,
      user_id: userData.user.id,
      rating: body.rating,
      comment: body.comment ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "report_id,user_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
