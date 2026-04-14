import { MagicLinkLoginForm } from "@/components/portal/magic-link-login-form";
import { AuthShell } from "@/components/portal/auth-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Secure Entry"
      title="Welcome back to the report workspace."
      description="Sign in with your account username and password, then continue into the workspace mapped to your tenant."
      footer="Authentication stays Supabase-backed while tenant access is still resolved from the signed-in user's email domain."
    >
      <MagicLinkLoginForm nextPath={params.next} />
    </AuthShell>
  );
}
