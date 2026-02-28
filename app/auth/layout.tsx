import { BrandLogo } from "@/components/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-auth-shellStart via-auth-shellMid to-auth-shellEnd p-4 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center md:min-h-[calc(100vh-5rem)]">
        <section className="grid w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-panel md:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-auth-heroStart via-auth-heroMid to-auth-heroEnd p-8 text-primary-foreground md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary-foreground)/0.2),transparent_40%),radial-gradient(circle_at_80%_10%,hsl(var(--primary-foreground)/0.15),transparent_35%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <BrandLogo size="hero" priority className="brightness-0 invert" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-bold leading-tight">Account Access</h2>
                <p className="max-w-sm text-sm text-primary-foreground/90">
                  Secure authentication for reports and administration.
                </p>
              </div>
              <p className="text-xs text-primary-foreground/80">Machine Vision Portal</p>
            </div>
          </div>
          <div className="flex items-center p-6 md:p-10">
            <div className="mx-auto w-full max-w-sm">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
