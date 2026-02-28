import { getProfile, requireAuthenticatedUser } from "@/lib/portal/auth";
import { logAccess } from "@/lib/portal/logging";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PostLoginPage() {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  let profile = await getProfile(user.id);

  if (!profile) {
    const roleHint = user.user_metadata?.role_hint;
    const role = roleHint === "admin" ? "admin" : "client";

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        role,
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

  if (profile.role === "admin") {
    redirect("/admin/reports");
  }

  redirect("/reports");
}
