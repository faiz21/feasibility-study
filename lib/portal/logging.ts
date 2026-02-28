import { createClient } from "@/lib/supabase/server";

export async function logAccess(params: {
  userId?: string | null;
  email?: string | null;
  roleText: string;
  clientId?: string | null;
  reportId?: string | null;
  reportPageId?: string | null;
  action: "login" | "report_open" | "page_view" | "logout";
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();

  await supabase.from("user_access_logs").insert({
    user_id: params.userId ?? null,
    email: params.email ?? null,
    role_text: params.roleText,
    client_id: params.clientId ?? null,
    report_id: params.reportId ?? null,
    report_page_id: params.reportPageId ?? null,
    action: params.action,
    metadata: params.metadata ?? {},
  });
}
