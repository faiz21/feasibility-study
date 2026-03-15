import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_REPORT_RUNNER_URL =
  "https://machinevisionind.app.n8n.cloud/webhook/3dcd6072-fae3-411b-8c15-a680337eced5";

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
        clientId?: string;
      }
    | null;
  const reportId = String(body?.reportId ?? "").trim();
  const pageId = String(body?.pageId ?? "").trim();
  const clientId = String(body?.clientId ?? "").trim();
  if (!reportId || !pageId || !clientId) {
    return NextResponse.json({ error: "reportId, pageId and clientId are required" }, { status: 400 });
  }

  const [{ data: reportRow, error: reportError }, { data: pageRow, error: pageError }] = await Promise.all([
    supabase
      .from("reports")
      .select("id,entity_id,report_type_template_id")
      .eq("id", reportId)
      .maybeSingle(),
    supabase
      .from("report_pages")
      .select("id,report_page_template_id")
      .eq("id", pageId)
      .eq("report_id", reportId)
      .maybeSingle(),
  ]);

  if (reportError || !reportRow) {
    return NextResponse.json({ error: reportError?.message ?? "Report not found" }, { status: 404 });
  }
  if (pageError || !pageRow) {
    return NextResponse.json({ error: pageError?.message ?? "Report page not found" }, { status: 404 });
  }

  if (!reportRow.entity_id || !reportRow.report_type_template_id || !pageRow.report_page_template_id) {
    return NextResponse.json(
      { error: "Missing entity_id, report_type_template_id, or report_page_template_id" },
      { status: 400 },
    );
  }

  const { data: entityRow, error: entityError } = await supabase
    .from("report_entities")
    .select("id,client_id,granularity_id")
    .eq("id", reportRow.entity_id)
    .maybeSingle();

  if (entityError || !entityRow) {
    return NextResponse.json({ error: entityError?.message ?? "Entity not found" }, { status: 404 });
  }

  const resolvedClientId = clientId || String(entityRow.client_id ?? "");
  if (!resolvedClientId || !entityRow.granularity_id) {
    return NextResponse.json(
      { error: "Missing current client_id or granularity_id" },
      { status: 400 },
    );
  }

  const webhookUrl =
    process.env.N8N_PAGE_RUNNER_WEBHOOK_URL?.trim() ||
    process.env.N8N_REPORT_RUNNER_WEBHOOK_URL?.trim() ||
    DEFAULT_REPORT_RUNNER_URL;

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
    body: JSON.stringify({
      report_type_template_id: reportRow.report_type_template_id,
      entity_id: reportRow.entity_id,
      client_id: resolvedClientId,
      granularity_id: entityRow.granularity_id,
      report_page_template_id: pageRow.report_page_template_id,
      forced: true,
    }),
    cache: "no-store",
    signal: controller.signal,
  }).catch(() => null);
  clearTimeout(timeout);

  if (!upstreamResponse) {
    return NextResponse.json(
      {
        error: "Failed to connect to page runner webhook",
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
    message: "Page runner triggered.",
    data: upstreamBody,
  });
}
