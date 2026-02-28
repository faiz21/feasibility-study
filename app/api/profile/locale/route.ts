import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toLocale } from "@/lib/i18n/dictionaries";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { locale?: string };
  const locale = toLocale(body.locale);

  const { error } = await supabase
    .from("profiles")
    .update({ locale })
    .eq("user_id", userData.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
