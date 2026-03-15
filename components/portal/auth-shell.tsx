"use client";

import { Languages, LayoutDashboard, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  footer?: string;
  children: React.ReactNode;
};

const highlights = [
  {
    title: "Role-based control",
    description: "Admin and client access stay isolated without changing the sign-in flow.",
    icon: ShieldCheck,
  },
  {
    title: "Report-first workspace",
    description: "Delivery, preview, and review stay centered around the active report context.",
    icon: LayoutDashboard,
  },
  {
    title: "Multilingual delivery",
    description: "Locale-aware access remains available from the same secure session shell.",
    icon: Languages,
  },
];

export function AuthShell({
  title,
  description,
  eyebrow = "Machine Vision Portal",
  footer = "Secure access for reports, client delivery, and administration.",
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-auth-shellStart via-auth-shellMid to-auth-shellEnd p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl items-center">
        <section className="glass-panel grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/92 shadow-panel lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-auth-heroStart via-auth-heroMid to-auth-heroEnd p-8 text-primary-foreground md:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.12),transparent_25%),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-40 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.1),transparent)] blur-2xl lg:block" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <BrandLogo size="hero" priority className="brightness-0 invert" />
                </div>
                <div className="max-w-xl space-y-4">
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/75">
                    {eyebrow}
                  </p>
                  <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl" data-font="display">
                    {title}
                  </h1>
                  <p className="max-w-lg text-base leading-7 text-primary-foreground/88 md:text-lg">
                    {description}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {highlights.map(({ title: itemTitle, description: itemDescription, icon: Icon }) => (
                  <article
                    key={itemTitle}
                    className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 font-sans text-base font-semibold tracking-tight text-white">{itemTitle}</h2>
                    <p className="mt-2 text-sm leading-6 text-primary-foreground/80">{itemDescription}</p>
                  </article>
                ))}
              </div>

              <p className="text-sm text-primary-foreground/72">{footer}</p>
            </div>
          </div>

          <div className="flex items-center p-5 md:p-8 lg:p-10">
            <div className={cn("mx-auto w-full max-w-md")}>{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
