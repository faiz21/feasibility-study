import { MagicLinkLoginForm } from "@/components/portal/magic-link-login-form";
import { AuthShell } from "@/components/portal/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Secure Entry"
      title="Welcome back to the report workspace."
      description="Choose the right role, continue with email access for clients, or enter the admin dashboard without breaking the operational flow."
      footer="Magic-link delivery stays powered by Supabase while the interface keeps role intent explicit."
    >
      <MagicLinkLoginForm />
    </AuthShell>
  );
}
