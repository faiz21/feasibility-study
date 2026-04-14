import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { toLocale, type Locale } from "@/lib/i18n/dictionaries";
import type { Profile } from "@/lib/portal/types";
import { getAdminPreviewClientId } from "@/lib/portal/admin-preview";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("user_id, role, client_id, locale")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    locale: toLocale(data.locale),
  };
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: "admin" | "client") {
  const user = await requireAuthenticatedUser();
  const profile = await getProfile(user.id);

  if (!profile) redirect("/login");

  if (role === "admin" && profile.role !== "admin") {
    redirect("/reports");
  }

  if (role === "client" && profile.role !== "client") {
    if (profile.role === "admin") {
      const previewClientId = await getAdminPreviewClientId();
      if (previewClientId) {
        return {
          user,
          profile: {
            ...profile,
            role: "client" as const,
            client_id: previewClientId,
          },
          isAdminPreview: true,
        };
      }
    }

    redirect("/admin/reports");
  }

  if (role === "client" && !profile.client_id) {
    redirect("/auth/post-login");
  }

  return { user, profile, isAdminPreview: false };
}

export async function resolveLocaleForUser(profile: Profile): Promise<Locale> {
  if (profile.locale) return profile.locale;

  if (!profile.client_id) return "en";

  const supabaseAdmin = createAdminClient();
  const { data } = await supabaseAdmin
    .from("clients")
    .select("default_locale")
    .eq("id", profile.client_id)
    .maybeSingle();

  return toLocale(data?.default_locale);
}
