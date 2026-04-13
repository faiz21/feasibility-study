const LOCALHOST_URL = "http://localhost:3000";

function normalizeUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getPublicSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  if (typeof window !== "undefined") {
    return normalizeUrl(window.location.origin);
  }

  return LOCALHOST_URL;
}
