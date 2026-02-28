import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { toLocale, type Locale } from "@/lib/i18n/dictionaries";
import type { Profile } from "@/lib/portal/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
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
    redirect("/admin/reports");
  }

  return { user, profile };
}

export async function resolveLocaleForUser(profile: Profile): Promise<Locale> {
  if (profile.locale) return profile.locale;

  if (!profile.client_id) return "en";

  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("default_locale")
    .eq("id", profile.client_id)
    .maybeSingle();

  return toLocale(data?.default_locale);
}
