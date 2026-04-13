"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicSiteUrl } from "@/lib/site-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const LAST_LOGIN_KEY = "portal-last-login";
const ADMIN_STATIC_PASSWORD = "admin@machinevision.global";
const ADMIN_LOGIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_LOGIN_EMAIL?.trim() || "admin@machinevision.global";

type RoleHint = "admin" | "client";

function readStored() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LAST_LOGIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      email: string;
      role: RoleHint;
      position?: string;
    };
  } catch {
    return null;
  }
}

export function MagicLinkLoginForm() {
  const stored = useMemo(readStored, []);
  const router = useRouter();
  const [email, setEmail] = useState(stored?.email ?? "");
  const [role, setRole] = useState<RoleHint | null>(stored?.role ?? null);
  const [adminPassword, setAdminPassword] = useState("");
  const [position, setPosition] = useState(stored?.position ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!role) {
        throw new Error("Please choose a role first.");
      }

      if (role === "admin" && adminPassword !== ADMIN_STATIC_PASSWORD) {
        throw new Error("Invalid admin password.");
      }

      const trimmedPosition = position.trim();
      if (role === "client" && !trimmedPosition) {
        throw new Error("Position is required for User role.");
      }

      const supabase = createClient();
      const siteUrl = getPublicSiteUrl();

      if (role === "admin") {
        const { error: adminSignInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_LOGIN_EMAIL,
          password: adminPassword,
        });
        if (adminSignInError) {
          throw new Error(
            `Admin login failed for ${ADMIN_LOGIN_EMAIL}. Check user email/password in Supabase Auth.`,
          );
        }

        localStorage.setItem(LAST_LOGIN_KEY, JSON.stringify({ role }));
        router.replace("/admin/reports");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm?next=/auth/post-login`,
          data:
            role === "client"
              ? { role_hint: role, position: trimmedPosition }
              : { role_hint: role },
        },
      });

      if (signInError) throw signInError;

      localStorage.setItem(
        LAST_LOGIN_KEY,
        JSON.stringify(
          role === "client"
            ? { email, role, position: trimmedPosition }
            : { role },
        ),
      );
      setSuccess("Check your email for the magic link.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Badge variant="secondary">Role-aware access</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Continue into the portal</h1>
          <p className="text-base leading-7 text-muted-foreground">
            Start by choosing whether you are entering the admin workspace or a client report session.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Role</p>
          {role ? <span className="text-sm text-muted-foreground">Selected: {role === "admin" ? "Admin" : "User"}</span> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
              role === "admin"
                ? "border-primary bg-primary text-primary-foreground shadow-lift"
                : "border-border/80 bg-card/85 text-foreground hover:-translate-y-0.5 hover:bg-surface-soft"
            }`}
            onClick={() => {
              setRole("admin");
              setPosition("");
              setError(null);
              setSuccess(null);
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${role === "admin" ? "bg-white/15" : "bg-primary-soft text-primary"}`}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold tracking-tight">Admin</p>
                <p className={`text-sm leading-6 ${role === "admin" ? "text-primary-foreground/86" : "text-muted-foreground"}`}>
                  Direct dashboard access for operations, setup, and report management.
                </p>
              </div>
            </div>
          </button>
          <button
            type="button"
            className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
              role === "client"
                ? "border-primary bg-primary text-primary-foreground shadow-lift"
                : "border-border/80 bg-card/85 text-foreground hover:-translate-y-0.5 hover:bg-surface-soft"
            }`}
            onClick={() => {
              setRole("client");
              setAdminPassword("");
              setError(null);
              setSuccess(null);
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${role === "client" ? "bg-white/15" : "bg-primary-soft text-primary"}`}>
                <UserRound className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold tracking-tight">User</p>
                <p className={`text-sm leading-6 ${role === "client" ? "text-primary-foreground/86" : "text-muted-foreground"}`}>
                  Receive a magic link and continue into the assigned client reports.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      {role ? (
        <>
          {role === "admin" ? (
            <div className="space-y-3 rounded-[1.35rem] border border-border/80 bg-surface-soft/90 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Enter admin password to login directly to the admin dashboard.
              </p>
              <label htmlFor="admin-password" className="text-sm font-medium">
                Admin password
              </label>
              <Input
                id="admin-password"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
          ) : (
            <div className="space-y-4 rounded-[1.35rem] border border-border/80 bg-surface-soft/90 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Use your work email so the magic link opens the correct client delivery context.
              </p>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Work email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  Position
                </label>
                <Input
                  id="position"
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Operations Manager"
                />
              </div>
            </div>
          )}
        </>
      ) : null}
      {role ? null : (
        <p className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          Select a role to continue.
        </p>
      )}
      {error && <p className="rounded-2xl border border-critical/25 bg-critical/10 px-4 py-3 text-sm text-critical">{error}</p>}
      {success && role !== "admin" && (
        <p className="rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>
      )}
      <Button type="submit" disabled={loading || !role} className="w-full">
        {loading
          ? "Sending..."
          : role === "admin"
            ? "Login to admin"
            : "Send user magic link"}
      </Button>
    </form>
  );
}
