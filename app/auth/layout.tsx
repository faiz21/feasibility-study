import { AuthShell } from "@/components/portal/auth-shell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthShell
      eyebrow="Machine Vision Identity"
      title="Account access for every report handoff."
      description="Recover access, create credentials, or update passwords without leaving the same client-delivery experience."
      footer="Authentication remains Supabase-backed and role-aware across admin and client routes."
    >
      {children}
    </AuthShell>
  );
}
