"use client";

import { useMemo, useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildPostLoginPath, safeNextPath } from "@/lib/portal/redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const LAST_LOGIN_KEY = "portal-last-login";

function readStored() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LAST_LOGIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      username?: string;
    };
  } catch {
    return null;
  }
}

export function MagicLinkLoginForm({ nextPath }: { nextPath?: string }) {
  const stored = useMemo(readStored, []);
  const router = useRouter();
  const [username, setUsername] = useState(stored?.username ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalizedUsername = username.trim().toLowerCase();
      if (!normalizedUsername) {
        throw new Error("Username is required.");
      }

      if (!password) {
        throw new Error("Password is required.");
      }

      const supabase = createClient();
      const next = safeNextPath(nextPath ?? null, "");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedUsername,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message || "Login failed.");
      }

      localStorage.setItem(
        LAST_LOGIN_KEY,
        JSON.stringify({
          username: normalizedUsername,
        }),
      );

      router.replace(buildPostLoginPath(next));
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Badge variant="secondary">Password Login</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Continue into the portal</h1>
          <p className="text-base leading-7 text-muted-foreground">
            Sign in with your account username and password. After login, the app resolves your tenant from your email domain.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-[1.35rem] border border-border/80 bg-surface-soft/90 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold tracking-tight">Username and password</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Use the account created in Supabase Auth. The username value should be the same email registered for that account.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="name@company.com"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-critical/25 bg-critical/10 px-4 py-3 text-sm text-critical">{error}</p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
