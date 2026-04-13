import { getProfile, requireAuthenticatedUser } from "@/lib/portal/auth";
import { logAccess } from "@/lib/portal/logging";
import { safeNextPath } from "@/lib/portal/redirect";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function normalizeDomain(value: string): string {
  return value.trim().toLowerCase().replace(/^www\./, "");
}

function getEmailDomain(email: string): string | null {
  const domain = email.split("@").pop();
  if (!domain) return null;
  const normalized = normalizeDomain(domain);
  return normalized.length > 0 ? normalized : null;
}

export default async function PostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const params = await searchParams;
  let profile = await getProfile(user.id);
  const next = safeNextPath(params.next, "");

  const roleHint = user.user_metadata?.role_hint;
  const role = profile ? profile.role : (roleHint === "admin" ? "admin" : "client");

  let clientId: string | null = profile?.client_id ?? null;

  if (role === "client") {
    const email = user.email ?? "";
    const userDomain = getEmailDomain(email);
    if (!userDomain) {
      redirect("/auth/error?error=Unauthorized:+Invalid+email");
    }

    const { data: domainClient, error: domainLookupError } = await supabase
        .from("clients")
        .select("id,domain")
        .eq("domain", userDomain)
        .maybeSingle();
    if (domainLookupError) {
      redirect(`/auth/error?error=${encodeURIComponent(domainLookupError.message)}`);
    }

    if (!domainClient) {
      redirect("/auth/error?error=Unauthorized:+Your+email+domain+is+not+registered");
    }

    if (!clientId || clientId !== domainClient.id) {
      clientId = domainClient.id;
      if (profile) {
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ client_id: clientId, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);

        if (updateProfileError) {
          redirect(`/auth/error?error=${encodeURIComponent(updateProfileError.message)}`);
        }

        if (profile) {
          profile.client_id = clientId;
        }
      }
    }
  }

  if (!profile) {
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        role,
        client_id: role === "client" ? clientId : null,
        locale: "en",
      },
      { onConflict: "user_id" },
    );

    if (error) {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }

    profile = await getProfile(user.id);
    if (!profile) {
      redirect("/auth/error?error=Unable+to+initialize+profile");
    }
  }

  await logAccess({
    userId: user.id,
    email: user.email,
    roleText: profile.role,
    clientId: profile.client_id,
    action: "login",
    metadata: { source: "magic_link" },
  });

  if (next) {
    redirect(next);
  }

  if (profile.role === "admin") {
    redirect("/admin/reports");
  }

  redirect("/reports");
}
