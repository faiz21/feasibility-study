import Link from "next/link";
import { ArrowRight, Languages, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const profile = await getProfile(data.user.id);
    if (profile?.role === "admin") redirect("/admin/reports");
    if (profile?.role === "client") redirect("/reports");
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-7xl items-center">
        <section className="glass-panel relative w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/92 shadow-panel">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_25%),radial-gradient(circle_at_85%_15%,hsl(var(--accent-blue)/0.14),transparent_20%),linear-gradient(135deg,transparent,rgba(255,255,255,0.45))]" />
          <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
            <div className="space-y-8">
              <div className="space-y-5">
                <BrandLogo size="header" priority />
                <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary-soft/85 px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  Secure client delivery
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] text-foreground md:text-6xl" data-font="display">
                    Multi-tenant report delivery without losing control of the workspace.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                    Machine Vision&apos;s portal brings client-specific access, multilingual delivery, admin preview, and report analytics into one coherent interface.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">
                    Open portal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/design-system">View design system</Link>
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    value: "Role-aware",
                    label: "Authentication separates client delivery from admin operations.",
                  },
                  {
                    value: "Multilingual",
                    label: "English, Indonesian, and Japanese report access stays built in.",
                  },
                  {
                    value: "Analytics-ready",
                    label: "Preview, activity, and ratings stay tied to real report workflows.",
                  },
                ].map((item) => (
                  <Card key={item.value}>
                    <CardContent className="space-y-3">
                      <p className="font-sans text-2xl font-semibold tracking-tight text-foreground">{item.value}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: "Report access",
                  description: "Client sessions open directly into assigned reports and remember locale context.",
                  icon: Languages,
                },
                {
                  title: "Admin control",
                  description: "Preview, publishing, and template operations stay available from the same shell.",
                  icon: ShieldCheck,
                },
                {
                  title: "Presentation quality",
                  description: "Report and case-study surfaces share the same token system while preserving editorial weight.",
                  icon: Sparkles,
                },
              ].map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="glass-panel rounded-[1.5rem] border border-border/80 bg-card/88 p-5 shadow-soft md:p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 font-sans text-xl font-semibold tracking-tight text-foreground">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
