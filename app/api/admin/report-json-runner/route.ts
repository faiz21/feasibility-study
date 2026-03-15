import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const body = (await request.json().catch(() => null)) as { reportId?: string } | null;
  const reportId = String(body?.reportId ?? "").trim();
  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  const { data: reportRow, error: reportError } = await supabase
    .from("reports")
    .select("id")
    .eq("id", reportId)
    .maybeSingle();
  if (reportError || !reportRow) {
    return NextResponse.json({ error: reportError?.message ?? "Report not found" }, { status: 404 });
  }

  const webhookUrl = process.env.N8N_REPORT_JSON_RUNNER_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Missing N8N_REPORT_JSON_RUNNER_WEBHOOK_URL env value" },
      { status: 500 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.N8N_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.N8N_WEBHOOK_TOKEN}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  const upstreamResponse = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ report_id: reportId }),
    cache: "no-store",
    signal: controller.signal,
  }).catch(() => null);
  clearTimeout(timeout);

  if (!upstreamResponse) {
    return NextResponse.json(
      {
        error: "Failed to connect to report json runner webhook",
        webhook_url: webhookUrl,
      },
      { status: 502 },
    );
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "";
  const upstreamBody = contentType.includes("application/json")
    ? await upstreamResponse.json().catch(() => null)
    : await upstreamResponse.text().catch(() => "");

  if (!upstreamResponse.ok) {
    const details = typeof upstreamBody === "string" ? upstreamBody : JSON.stringify(upstreamBody);
    return NextResponse.json(
      {
        error: `n8n error: ${details}`,
        webhook_url: webhookUrl,
        upstream_status: upstreamResponse.status,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Report JSON runner triggered.",
    data: upstreamBody,
  });
}
