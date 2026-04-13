import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const profile = await getProfile(data.user.id);
    if (profile?.role === "admin") {
      redirect("/admin/reports");
    }
    if (profile?.role === "client") {
      redirect("/reports");
    }
  }

  redirect("/login");
}
