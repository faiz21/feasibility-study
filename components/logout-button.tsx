"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "border-border/80 bg-card/85 text-foreground shadow-soft hover:bg-surface-soft hover:text-foreground",
        className,
      )}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
