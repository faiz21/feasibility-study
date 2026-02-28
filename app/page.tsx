import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const profile = await getProfile(data.user.id);
    if (profile?.role === "admin") redirect("/admin/reports");
    if (profile?.role === "client") redirect("/reports");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-auth-shellStart via-auth-shellMid to-auth-shellEnd p-4 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-4xl items-center md:min-h-[calc(100vh-5rem)]">
        <section className="w-full rounded-2xl border border-border/60 bg-card p-8 shadow-panel md:p-12">
          <div className="flex flex-col items-center text-center">
            <BrandLogo size="header" priority />
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">Multi-Tenant Report Portal</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Secure multilingual report delivery with role-based access, tracking, and analytics.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
            >
              Go to login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
