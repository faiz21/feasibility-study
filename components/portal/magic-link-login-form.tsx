"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      const origin = window.location.origin;

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
          emailRedirectTo: `${origin}/auth/confirm?next=/auth/post-login`,
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">Choose your role to continue.</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Role</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm transition ${
              role === "admin"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent"
            }`}
            onClick={() => {
              setRole("admin");
              setPosition("");
              setError(null);
              setSuccess(null);
            }}
          >
            Admin
          </button>
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm transition ${
              role === "client"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent"
            }`}
            onClick={() => {
              setRole("client");
              setAdminPassword("");
              setError(null);
              setSuccess(null);
            }}
          >
            User
          </button>
        </div>
      </div>
      {role ? (
        <>
          {role === "admin" ? (
            <div className="space-y-2 rounded-md border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                Enter admin password to login directly to the admin dashboard.
              </p>
              <label htmlFor="admin-password" className="text-sm">
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
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm">
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
                <label htmlFor="position" className="text-sm">
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
        <p className="rounded border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          Select a role to continue.
        </p>
      )}
      {error && <p className="text-sm text-critical">{error}</p>}
      {success && role !== "admin" && <p className="text-sm text-success">{success}</p>}
      <Button type="submit" disabled={loading || !role} className="h-10 w-full">
        {loading
          ? "Sending..."
          : role === "admin"
            ? "Login to admin"
            : "Send user magic link"}
      </Button>
    </form>
  );
}
