import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  session_id?: string;
  report_id?: string;
  message?: string;
  is_done?: boolean;
  sections?: Record<string, string>;
  history?: ChatMessage[];
  raw_report?: string;
  full_en_report?: string;
  selected_sections?: Array<{
    name?: string;
    content?: string;
    remark?: string;
  }>;
};

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

  const body = (await request.json().catch(() => null)) as ChatRequest | null;
  const sessionId = String(body?.session_id ?? "").trim();
  const reportId = String(body?.report_id ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const isDone = Boolean(body?.is_done);
  const sections = body?.sections && typeof body.sections === "object" ? body.sections : {};
  const history = Array.isArray(body?.history) ? body?.history : [];
  const rawReport = typeof body?.raw_report === "string" ? body.raw_report : "";
  const fullEnReport = typeof body?.full_en_report === "string" ? body.full_en_report : "";
  const selectedSections = Array.isArray(body?.selected_sections)
    ? body.selected_sections
        .map((section) => ({
          name: String(section?.name ?? "").trim(),
          content: String(section?.content ?? "").trim(),
          remark: String(section?.remark ?? "").trim(),
        }))
        .filter((section) => section.name && section.content)
    : [];

  if (!sessionId || !reportId || !message) {
    return NextResponse.json({ error: "session_id, report_id, and message are required" }, { status: 400 });
  }

  const { data: reportRow, error: reportError } = await supabase
    .from("reports")
    .select("id")
    .eq("id", reportId)
    .maybeSingle();

  if (reportError || !reportRow) {
    return NextResponse.json({ error: reportError?.message ?? "Report not found" }, { status: 404 });
  }

  const isProd = process.env.NODE_ENV === "production";
  const webhookUrl =
    (isProd ? process.env.N8N_WEBHOOK_URL : process.env.N8N_WEBHOOK_TEST_URL) ||
    process.env.N8N_WEBHOOK_URL ||
    process.env.N8N_WEBHOOK_TEST_URL ||
    process.env.N8N_REPORT_REVIEW_WEBHOOK_URL ||
    process.env.N8N_AGENT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      {
        error:
          "n8n webhook is not configured. Set N8N_WEBHOOK_URL (prod) and/or N8N_WEBHOOK_TEST_URL (dev).",
      },
      { status: 500 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.N8N_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.N8N_WEBHOOK_TOKEN}`;
  }

  const upstreamPayload = {
    session_id: sessionId,
    report_id: reportId,
    message,
    is_done: isDone,
    sections,
    history,
    raw_report: rawReport,
    full_en_report: fullEnReport,
    selected_sections: selectedSections,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300000);

  const upstreamResponse = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(upstreamPayload),
    cache: "no-store",
    signal: controller.signal,
  }).catch(() => null);
  clearTimeout(timeout);

  if (!upstreamResponse) {
    return NextResponse.json({ error: "Failed to connect to n8n webhook" }, { status: 502 });
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "";
  const upstreamBody = contentType.includes("application/json")
    ? await upstreamResponse.json().catch(() => null)
    : await upstreamResponse.text().catch(() => "");

  if (!upstreamResponse.ok) {
    const details = typeof upstreamBody === "string" ? upstreamBody : JSON.stringify(upstreamBody);
    return NextResponse.json({ error: `n8n error: ${details}` }, { status: 502 });
  }

  return NextResponse.json(upstreamBody);
}
