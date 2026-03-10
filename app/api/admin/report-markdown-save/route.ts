import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getLocaleColumn(locale: string): "raw_report" | "raw_report_id" | "raw_report_jp" {
  if (locale === "id") return "raw_report_id";
  if (locale === "ja") return "raw_report_jp";
  return "raw_report";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        reportId?: string;
        pageId?: string;
        locale?: string;
        markdown?: string;
        overall?: number | null;
        outline_alignment?: number | null;
        writing_alignment?: number | null;
        analysis_score?: number | null;
        notes?: string[] | null;
        page_summary?: string | null;
      }
    | null;

  const reportId = String(body?.reportId ?? "").trim();
  const pageId = String(body?.pageId ?? "").trim();
  const locale = ["en", "id", "ja"].includes(String(body?.locale ?? "")) ? String(body?.locale) : "en";
  const markdown = String(body?.markdown ?? "");
  const hasOverall = typeof body?.overall === "number";
  const hasOutline = typeof body?.outline_alignment === "number";
  const hasWriting = typeof body?.writing_alignment === "number";
  const hasAnalysis = typeof body?.analysis_score === "number";
  const hasNotes = Array.isArray(body?.notes);
  const hasSummary = typeof body?.page_summary === "string";

  if (!reportId || !pageId) {
    return NextResponse.json({ error: "reportId and pageId are required" }, { status: 400 });
  }

  const localeColumn = getLocaleColumn(locale);
  const updatePayload: Record<string, unknown> = {
    [localeColumn]: markdown,
    updated_at: new Date().toISOString(),
  };
  if (hasOverall) updatePayload.overall = body?.overall;
  if (hasOutline) updatePayload.outline_alignment = body?.outline_alignment;
  if (hasWriting) updatePayload.writing_alignment = body?.writing_alignment;
  if (hasAnalysis) updatePayload.analysis_score = body?.analysis_score;
  if (hasNotes) {
    updatePayload.notes = (body?.notes ?? []).filter((item) => typeof item === "string");
  }
  if (hasSummary) updatePayload.page_summary = body?.page_summary;

  const { error } = await supabase
    .from("report_pages")
    .update(updatePayload)
    .eq("id", pageId)
    .eq("report_id", reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
