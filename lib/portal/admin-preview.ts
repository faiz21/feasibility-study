import { cookies } from "next/headers";

export const ADMIN_PREVIEW_CLIENT_COOKIE = "mv_admin_preview_client_id";

export async function getAdminPreviewClientId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_PREVIEW_CLIENT_COOKIE)?.value?.trim();
  return value || null;
}

export async function setAdminPreviewClientId(clientId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_PREVIEW_CLIENT_COOKIE, clientId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminPreviewClientId() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_PREVIEW_CLIENT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
