"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { ReportsUiTheme } from "@/lib/report-view-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";

type ReportPage = {
  id: string;
  page_order: number;
  html: string;
  title: string;
  code?: string;
};

function isFullDocumentHtml(html: string): boolean {
  const normalized = html.trim().toLowerCase();
  return (
    normalized.startsWith("<!doctype html") ||
    normalized.includes("<html") ||
    normalized.includes("<head") ||
    normalized.includes("<body") ||
    normalized.includes("<script") ||
    normalized.includes("<style") ||
    normalized.includes("</html>")
  );
}

const LIGHT_VIEWER_THEME: ReportsUiTheme = {
  surface: "#F4F7FC",
  surfaceElevated: "#FFFFFF",
  surfaceMuted: "#E7EEF8",
  surfaceSidebar: "#0F1B34",
  surfaceOverlay: "rgba(11, 21, 48, 0.72)",
  textPrimary: "#0B1530",
  textSecondary: "#52627D",
  textInverted: "#F8FBFF",
  border: "#CFD9EB",
  borderStrong: "#AFC0DE",
  accent: "#1D4ED8",
  accentHover: "#173FAF",
  accentSoft: "#DCE8FF",
  accentContrast: "#F8FBFF",
  focusRing: "#5B86FF",
  info: "#0EA5E9",
  success: "#169C68",
  warning: "#D97706",
  critical: "#D14343",
};

const DARK_VIEWER_THEME: ReportsUiTheme = {
  surface: "#111827",
  surfaceElevated: "#172033",
  surfaceMuted: "#202B3F",
  surfaceSidebar: "#09111F",
  surfaceOverlay: "rgba(4, 10, 20, 0.78)",
  textPrimary: "#F3F7FF",
  textSecondary: "#A2B0C9",
  textInverted: "#0B1530",
  border: "#2D3A54",
  borderStrong: "#476180",
  accent: "#79A7FF",
  accentHover: "#94B9FF",
  accentSoft: "#1D3152",
  accentContrast: "#08111F",
  focusRing: "#79A7FF",
  info: "#4FC3F7",
  success: "#34C38F",
  warning: "#F5B14A",
  critical: "#F17878",
};

function resolveViewerTheme(isDarkMode: boolean, fallback?: ReportsUiTheme): ReportsUiTheme {
  if (isDarkMode) return DARK_VIEWER_THEME;
  return fallback ? { ...LIGHT_VIEWER_THEME, ...fallback } : LIGHT_VIEWER_THEME;
}

function buildEmbeddedDocumentStyles(theme: ReportsUiTheme, isDarkMode: boolean) {
  return `
    :root {
      color-scheme: ${isDarkMode ? "dark" : "light"};
      --viewer-page-max: min(1700px, calc(100vw - 3rem));
      --viewer-copy-max: min(1500px, calc(100vw - 5rem));
      --viewer-copy-narrow: min(1360px, calc(100vw - 6rem));
      --viewer-surface: ${theme.surface};
      --viewer-surface-elevated: ${theme.surfaceElevated};
      --viewer-surface-muted: ${theme.surfaceMuted};
      --viewer-text: ${theme.textPrimary};
      --viewer-text-muted: ${theme.textSecondary};
      --viewer-border: ${theme.border};
      --viewer-border-strong: ${theme.borderStrong};
      --viewer-accent: ${theme.accent};
      --viewer-accent-soft: ${theme.accentSoft};
    }

    html, body {
      margin: 0;
      background: var(--viewer-surface) !important;
      color: var(--viewer-text) !important;
    }

    #report-root,
    body > main,
    main,
    main[class*="max-w-"],
    [class*="max-w-[1440px]"] {
      width: var(--viewer-page-max) !important;
      max-width: var(--viewer-page-max) !important;
    }

    [class*="max-w-6xl"],
    [class*="max-w-5xl"] {
      max-width: var(--viewer-copy-max) !important;
    }

    [class*="max-w-4xl"],
    [class*="max-w-3xl"] {
      max-width: var(--viewer-copy-narrow) !important;
    }

    [class*="md:col-start-3"] {
      grid-column-start: 2 !important;
    }

    [class*="md:col-span-8"] {
      grid-column: span 10 / span 10 !important;
    }

    [class*="md:col-span-7"] {
      grid-column: span 9 / span 9 !important;
    }

    @media (max-width: 1279px) {
      :root {
        --viewer-page-max: min(1500px, calc(100vw - 2rem));
        --viewer-copy-max: min(1400px, calc(100vw - 3rem));
        --viewer-copy-narrow: min(1300px, calc(100vw - 3.5rem));
      }
    }

    ${
      isDarkMode
        ? `
    .dark-glass,
    .glass-card,
    blockquote,
    [class*="bg-white"],
    [class*="bg-slate-50"],
    [class*="bg-slate-100"] {
      background: var(--viewer-surface-elevated) !important;
      color: var(--viewer-text) !important;
      border-color: var(--viewer-border) !important;
      box-shadow: 0 24px 55px -32px rgba(0, 0, 0, 0.55) !important;
    }

    [class*="bg-slate-900"] {
      background: linear-gradient(180deg, #09111f, #10192a) !important;
    }

    [class*="text-slate-900"],
    [class*="text-slate-800"],
    [class*="text-slate-700"] {
      color: var(--viewer-text) !important;
    }

    [class*="text-slate-600"],
    [class*="text-slate-500"],
    [class*="text-slate-400"] {
      color: var(--viewer-text-muted) !important;
    }

    [class*="border-slate-200"],
    [class*="border-slate-100"],
    [class*="border-white/20"] {
      border-color: var(--viewer-border) !important;
    }

    [class*="text-report-500"],
    [class*="text-report-600"],
    a {
      color: var(--viewer-accent) !important;
    }

    [class*="bg-report-100"],
    [class*="bg-report-500/20"] {
      background: var(--viewer-accent-soft) !important;
    }

    [class*="border-report-500"],
    [class*="border-report-500/30"] {
      border-color: var(--viewer-accent) !important;
    }
    `
        : `
    .dark-glass,
    .glass-card {
      border-color: var(--viewer-border) !important;
    }
    `
    }
  `;
}

function injectEmbeddedDocumentStyles(
  html: string,
  theme: ReportsUiTheme,
  isDarkMode: boolean,
): string {
  const styleTag = `<style id="portal-report-viewer-styles">${buildEmbeddedDocumentStyles(theme, isDarkMode)}</style>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleTag}</head>`);
  }

  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body([^>]*)>/i, `<body$1>${styleTag}`);
  }

  return `${styleTag}${html}`;
}

export function ReportViewer({
  reportId,
  locale,
  pages,
  initialRatingsByPageId,
  previewMode,
  reportTheme,
}: {
  reportId: string;
  locale: "en" | "id" | "ja";
  pages: ReportPage[];
  initialRatingsByPageId?: Record<
    string,
    {
      rating: number;
      comment: string;
      hasExisting: boolean;
    }
  >;
  previewMode?: boolean;
  reportTheme?: ReportsUiTheme;
}) {
  const { resolvedTheme } = useTheme();
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [showGoTop, setShowGoTop] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingsByPageId, setRatingsByPageId] = useState(initialRatingsByPageId ?? {});
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const initializedFromProps = useRef(false);

  useEffect(() => {
    const onScroll = () => setShowGoTop(window.scrollY > 360);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sorted = useMemo(
    () => [...pages].sort((a, b) => a.page_order - b.page_order),
    [pages],
  );
  const viewerTheme = useMemo(
    () => resolveViewerTheme(resolvedTheme === "dark", reportTheme),
    [reportTheme, resolvedTheme],
  );

  useEffect(() => {
    if (!initializedFromProps.current) {
      setRatingsByPageId(initialRatingsByPageId ?? {});
      initializedFromProps.current = true;
    }
  }, [initialRatingsByPageId]);

  useEffect(() => {
    const currentActiveExists = activePageId && sorted.some((page) => page.id === activePageId);
    if (currentActiveExists) return;
    const firstPage = sorted[0];
    if (firstPage) setActivePageId(firstPage.id);
  }, [activePageId, sorted]);

  useEffect(() => {
    if (!activePageId) return;
    const existing = ratingsByPageId[activePageId];
    setRating(existing?.rating ?? 5);
    setComment(existing?.comment ?? "");
    setHasSubmittedRating(Boolean(existing?.hasExisting));
    setRatingMessage(null);
  }, [activePageId, ratingsByPageId]);

  useEffect(() => {
    if (previewMode) return;
    const timer = setInterval(async () => {
      if (!activePageId) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      const maxScrollPct = Math.min(100, ((scrollTop + viewport) / Math.max(scrollHeight, 1)) * 100);

      try {
        const [activityRes, resumeRes] = await Promise.all([
          fetch(`/api/reports/${reportId}/activity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reportPageId: activePageId,
              locale,
              maxScrollPct,
              deltaSec: 10,
              complete: maxScrollPct >= 90,
            }),
          }),
          fetch(`/api/reports/${reportId}/resume`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lastPageId: activePageId,
              lastScrollY: window.scrollY,
              lastLocale: locale,
            }),
          }),
        ]);

        if (activityRes.ok && resumeRes.ok) {
          setLastSyncAt(new Date());
        }
      } catch {
        return;
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [activePageId, locale, previewMode, reportId]);

  const activePage = sorted.find((page) => page.id === activePageId) ?? sorted[0] ?? null;
  const reviewedPageIds = useMemo(
    () => new Set(Object.entries(ratingsByPageId).filter(([, v]) => v?.hasExisting).map(([key]) => key)),
    [ratingsByPageId],
  );
  const activePageHtml = useMemo(() => {
    if (!activePage) return null;
    if (!isFullDocumentHtml(activePage.html)) return activePage.html;
    return injectEmbeddedDocumentStyles(activePage.html, viewerTheme, resolvedTheme === "dark");
  }, [activePage, resolvedTheme, viewerTheme]);

  const activatePage = (pageId: string) => {
    setActivePageId(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {sorted.length > 0 && (
        <nav className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 rounded-[1.6rem] border border-border/70 bg-card/85 px-2 py-4 shadow-panel backdrop-blur-xl xl:flex 2xl:right-8">
          {sorted.map((page) => {
            const isActive = activePageId === page.id;
            const isReviewed = reviewedPageIds.has(page.id);
            return (
              <button
                key={`nav-${page.id}`}
                onClick={() => activatePage(page.id)}
                className="group/item flex items-center gap-3 justify-end focus:outline-none relative"
                aria-label={`Scroll to ${page.title}`}
              >
                <span
                  className={`
                    pointer-events-none absolute right-14 inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold shadow-md backdrop-blur-md
                    opacity-0 translate-x-2 scale-95 transition-all duration-300 ease-out
                    group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:scale-100
                    ${isActive ? "border-primary/35 bg-popover/95 text-primary" : "border-border/80 bg-popover/95 text-muted-foreground"}
                  `}
                  style={{
                    borderColor: viewerTheme.borderStrong,
                    background: viewerTheme.surfaceElevated,
                    color: isActive ? viewerTheme.accent : viewerTheme.textSecondary,
                  }}
                >
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${isActive ? "bg-primary/15 text-primary" : "bg-accent/40 text-foreground"}`}
                    style={{
                      background: isActive ? viewerTheme.accentSoft : viewerTheme.surfaceMuted,
                      color: isActive ? viewerTheme.accent : viewerTheme.textPrimary,
                    }}
                  >
                    {page.code ?? `P${page.page_order}`}
                  </span>
                  {page.title}
                </span>

                <span
                  className={`
                    relative inline-flex h-10 min-w-[3.75rem] items-center justify-center rounded-[1rem] border px-3 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-out
                    ${isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-primary/40 ring-2 ring-primary/20"
                      : "border-border bg-card text-muted-foreground group-hover/item:border-primary/50 group-hover/item:text-primary group-hover/item:-translate-y-0.5"}
                  `}
                  style={
                    isActive
                      ? {
                          borderColor: viewerTheme.accent,
                          background: viewerTheme.accent,
                          color: viewerTheme.accentContrast,
                        }
                      : {
                          borderColor: viewerTheme.border,
                          background: viewerTheme.surfaceElevated,
                          color: viewerTheme.textSecondary,
                        }
                  }
                >
                  {page.code ?? `P${page.page_order}`}
                  {isReviewed ? (
                    <span
                      className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border"
                      style={{
                        background: viewerTheme.success,
                        borderColor: viewerTheme.surfaceElevated,
                      }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {sorted.length > 0 ? (
        <div className="mb-6 xl:hidden">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: viewerTheme.textSecondary }}>
            Page
          </label>
          <select
            className="h-11 w-full rounded-xl border px-4 text-sm font-medium shadow-soft"
            value={activePage?.id ?? ""}
            onChange={(event) => activatePage(event.target.value)}
            style={{
              borderColor: viewerTheme.borderStrong,
              background: viewerTheme.surfaceElevated,
              color: viewerTheme.textPrimary,
            }}
            aria-label="Select report page"
          >
            {sorted.map((page) => (
              <option key={`mobile-page-${page.id}`} value={page.id}>
                {(page.code ?? `P${page.page_order}`) + " - " + page.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="relative space-y-10 xl:pr-20">
        {activePage ? (
          <section id={`page-${activePage.id}`} className="scroll-mt-24">
            {isFullDocumentHtml(activePage.html) ? (
              <iframe
                title={`report-page-${activePage.id}`}
                srcDoc={activePageHtml ?? activePage.html}
                className="h-[117vh] min-h-[1100px] w-full rounded-[1.5rem] border shadow-panel"
                style={{
                  borderColor: viewerTheme.borderStrong,
                  background: viewerTheme.surfaceElevated,
                }}
              />
            ) : (
              <div
                className="glass-panel prose prose-neutral max-w-none rounded-[1.6rem] border border-border/80 bg-card/90 p-5 text-base leading-relaxed shadow-soft transition-colors dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 md:p-8"
                dangerouslySetInnerHTML={{ __html: activePage.html }}
              />
            )}
          </section>
        ) : null}

        <section
          className="relative overflow-hidden rounded-[1.6rem] border p-6 md:p-8"
          style={{
            borderColor: viewerTheme.borderStrong,
            background: viewerTheme.surfaceElevated,
            boxShadow: "0 10px 35px -24px rgba(15, 23, 42, 0.35)",
          }}
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Reader feedback</Badge>
              <h3 className="text-3xl font-bold tracking-tight" style={{ color: viewerTheme.textPrimary }}>
                Rate this report
              </h3>
              <p className="max-w-2xl text-base leading-7" style={{ color: viewerTheme.textSecondary }}>
                Your feedback helps us improve reporting clarity, visual structure, and follow-up quality.
              </p>
            </div>
            {activePage ? (
              <div className="text-sm font-medium" style={{ color: viewerTheme.textSecondary }}>
                Active page: {activePage.code ?? `P${activePage.page_order}`} {activePage.title}
              </div>
            ) : null}
          </div>
          {previewMode ? (
            <StatusBanner tone="info" className="mb-4">
              Admin preview mode: interaction tracking and rating submission are disabled.
            </StatusBanner>
          ) : null}
          {lastSyncAt ? (
            <p className="mb-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Reading progress synced at {lastSyncAt.toLocaleTimeString()}.
            </p>
          ) : null}
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
            <div
              className="flex rounded-2xl border p-1.5"
              style={{ background: viewerTheme.surfaceMuted, borderColor: viewerTheme.borderStrong }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-11 w-12 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    rating >= star
                      ? "shadow-sm"
                      : "hover:-translate-y-0.5"
                  }`}
                  style={
                    rating >= star
                      ? { background: viewerTheme.accent, color: viewerTheme.accentContrast }
                      : {
                          background: viewerTheme.surfaceElevated,
                          color: viewerTheme.textSecondary,
                          border: `1px solid ${viewerTheme.border}`,
                        }
                  }
                >
                  {star}
                </button>
              ))}
            </div>
            <Input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Optional review note"
              className="max-w-md"
              style={{
                borderColor: viewerTheme.borderStrong,
                background: viewerTheme.surfaceElevated,
                color: viewerTheme.textPrimary,
              }}
            />
            <Button
              disabled={ratingSubmitting || previewMode}
              className="min-w-[12rem]"
              style={{
                background: viewerTheme.accent,
                color: viewerTheme.accentContrast,
              }}
              onClick={async () => {
                if (previewMode) return;
                if (!activePageId) {
                  setRatingMessage("No page selected.");
                  return;
                }
                setRatingSubmitting(true);
                setRatingMessage(null);
                try {
                  const response = await fetch(`/api/reports/${reportId}/rating`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rating, comment: comment.trim() || null, reportPageId: activePageId }),
                  });
                  if (!response.ok) {
                    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
                    setRatingMessage(payload?.error ?? "Failed to submit rating.");
                    return;
                  }
                  setRatingsByPageId((prev) => ({
                    ...prev,
                    [activePageId]: {
                      rating,
                      comment: comment.trim(),
                      hasExisting: true,
                    },
                  }));
                  const pageCode = activePage?.code ?? `P${activePage?.page_order ?? ""}`;
                  setRatingMessage(hasSubmittedRating ? `Feedback updated for ${pageCode}.` : `Feedback saved for ${pageCode}.`);
                  setHasSubmittedRating(true);
                } finally {
                  setRatingSubmitting(false);
                }
              }}
            >
              {ratingSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
          {ratingMessage ? (
            <p className="mt-4 text-sm text-muted-foreground" style={{ color: viewerTheme.textSecondary }}>{ratingMessage}</p>
          ) : null}
        </section>
      </div>

      {showGoTop ? (
        <Button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outline"
          className="fixed bottom-6 right-6 z-50 rounded-full px-4 text-xs font-semibold shadow-md backdrop-blur-md xl:right-24"
          aria-label="Go to top"
          style={{
            borderColor: viewerTheme.borderStrong,
            background: viewerTheme.surfaceElevated,
            color: viewerTheme.textPrimary,
          }}
        >
          Top
        </Button>
      ) : null}
    </>
  );
}
