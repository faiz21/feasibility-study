import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toLocale } from "@/lib/i18n/dictionaries";
import { logAccess } from "@/lib/portal/logging";

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
    reportPageId: string;
    deltaSec: number;
    maxScrollPct: number;
    complete?: boolean;
    locale?: string;
  };

  const { data: existing } = await supabase
    .from("report_page_activity")
    .select("id,time_spent_sec,max_scroll_pct,open_count,completed_at")
    .eq("report_id", reportId)
    .eq("report_page_id", body.reportPageId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  const nextTime = (existing?.time_spent_sec ?? 0) + Math.max(0, body.deltaSec ?? 0);
  const nextScroll = Math.max(existing?.max_scroll_pct ?? 0, body.maxScrollPct ?? 0);
  const markCompleted = body.complete && nextTime >= 15 && nextScroll >= 90;

  const payload = {
    report_id: reportId,
    report_page_id: body.reportPageId,
    user_id: userData.user.id,
    time_spent_sec: nextTime,
    max_scroll_pct: nextScroll,
    open_count: (existing?.open_count ?? 0) + (existing ? 0 : 1),
    last_seen_at: new Date().toISOString(),
    completed_at: markCompleted ? new Date().toISOString() : existing?.completed_at,
    last_locale: toLocale(body.locale),
  };

  const { error } = await supabase
    .from("report_page_activity")
    .upsert(payload, { onConflict: "report_page_id,user_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, client_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  await logAccess({
    userId: userData.user.id,
    email: userData.user.email,
    roleText: profile?.role ?? "client",
    clientId: profile?.client_id ?? null,
    reportId,
    reportPageId: body.reportPageId,
    action: "page_view",
    metadata: { locale: toLocale(body.locale), deltaSec: body.deltaSec ?? 0 },
  });

  return NextResponse.json({ ok: true });
}
