import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toLocale } from "@/lib/i18n/dictionaries";

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

  const body = (await request.json()) as {
    lastPageId: string;
    lastScrollY?: number;
    lastAnchor?: string;
    lastLocale?: string;
  };

  const { error } = await supabase.from("report_resume").upsert(
    {
      report_id: reportId,
      user_id: userData.user.id,
      last_page_id: body.lastPageId,
      last_scroll_y: body.lastScrollY ?? 0,
      last_anchor: body.lastAnchor,
      last_locale: toLocale(body.lastLocale),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "report_id,user_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
