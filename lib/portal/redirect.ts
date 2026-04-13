const DEFAULT_POST_LOGIN_PATH = "/auth/post-login";

export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}

export function buildPostLoginPath(next: string | null | undefined): string {
  const safeNext = safeNextPath(next, "");
  if (!safeNext) {
    return DEFAULT_POST_LOGIN_PATH;
  }

  const params = new URLSearchParams({ next: safeNext });
  return `${DEFAULT_POST_LOGIN_PATH}?${params.toString()}`;
}
