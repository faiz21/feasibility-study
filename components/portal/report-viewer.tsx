"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReportsUiTheme } from "@/lib/report-view-theme";

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

  const activatePage = (pageId: string) => {
    setActivePageId(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {sorted.length > 0 && (
        <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 py-4 px-2">
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
                    pointer-events-none absolute right-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md
                    opacity-0 translate-x-2 scale-95 transition-all duration-300 ease-out
                    group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:scale-100
                    ${isActive ? "border-primary/35 bg-popover/95 text-primary" : "border-border/80 bg-popover/95 text-muted-foreground"}
                  `}
                  style={{
                    borderColor: reportTheme?.borderStrong,
                    background: reportTheme?.surfaceElevated,
                    color: isActive ? reportTheme?.accent : reportTheme?.textSecondary,
                  }}
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${isActive ? "bg-primary/15 text-primary" : "bg-accent/40 text-foreground"}`}
                    style={{
                      background: isActive ? reportTheme?.accentSoft : reportTheme?.surfaceMuted,
                      color: isActive ? reportTheme?.accent : reportTheme?.textPrimary,
                    }}
                  >
                    {page.code ?? `P${page.page_order}`}
                  </span>
                  {page.title}
                </span>

                <span
                  className={`
                    inline-flex h-8 min-w-[3.25rem] items-center justify-center rounded-full border px-2 text-[10px] font-bold tracking-wide transition-all duration-300 ease-out relative
                    ${isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-primary/40 ring-2 ring-primary/20"
                      : "border-border bg-card text-muted-foreground group-hover/item:border-primary/50 group-hover/item:text-primary group-hover/item:-translate-y-0.5"}
                  `}
                  style={
                    isActive
                      ? {
                          borderColor: reportTheme?.accent,
                          background: reportTheme?.accent,
                          color: reportTheme?.accentContrast,
                        }
                      : {
                          borderColor: reportTheme?.border,
                          background: reportTheme?.surfaceElevated,
                          color: reportTheme?.textSecondary,
                        }
                  }
                >
                  {page.code ?? `P${page.page_order}`}
                  {isReviewed ? (
                    <span
                      className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border"
                      style={{
                        background: reportTheme?.success ?? "#16A34A",
                        borderColor: reportTheme?.surfaceElevated,
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
        <div className="mb-4 md:hidden">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: reportTheme?.textSecondary }}>
            Page
          </label>
          <select
            className="h-10 w-full rounded-lg border px-3 text-sm font-medium"
            value={activePage?.id ?? ""}
            onChange={(event) => activatePage(event.target.value)}
            style={{
              borderColor: reportTheme?.borderStrong,
              background: reportTheme?.surfaceElevated,
              color: reportTheme?.textPrimary,
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

      <div className="space-y-8 md:pr-16 relative">
        {activePage ? (
          <section id={`page-${activePage.id}`} className="scroll-mt-24">
            {isFullDocumentHtml(activePage.html) ? (
              <iframe
                title={`report-page-${activePage.id}`}
                srcDoc={activePage.html}
                className="h-[78vh] w-full bg-white"
              />
            ) : (
              <div
                className="text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 transition-colors"
                dangerouslySetInnerHTML={{ __html: activePage.html }}
              />
            )}
          </section>
        ) : null}

        <section
          className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
          style={{
            borderColor: reportTheme?.borderStrong,
            background: reportTheme?.surfaceElevated ?? "#FFFFFF",
            boxShadow: "0 10px 35px -24px rgba(15, 23, 42, 0.35)",
          }}
        >
          <h3 className="mb-2 text-3xl font-bold tracking-tight" style={{ color: reportTheme?.textPrimary }}>
            Rate this report
          </h3>
          <p className="mb-6 text-lg" style={{ color: reportTheme?.textSecondary }}>
            Your feedback helps us improve our reporting quality.
          </p>
          {previewMode ? (
            <p
              className="mb-4 rounded-xl border px-4 py-3 text-sm font-medium"
              style={{
                borderColor: reportTheme?.borderStrong,
                background: reportTheme?.surfaceMuted,
                color: reportTheme?.textSecondary,
              }}
            >
              Admin preview mode: interaction tracking and rating submission are disabled.
            </p>
          ) : null}
          {lastSyncAt ? (
            <p className="mb-3 text-xs text-muted-foreground">
              Reading progress synced at {lastSyncAt.toLocaleTimeString()}.
            </p>
          ) : null}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              className="flex rounded-xl border p-1"
              style={{ background: reportTheme?.surfaceMuted, borderColor: reportTheme?.borderStrong }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-10 w-12 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    rating >= star
                      ? "shadow-sm"
                      : "hover:-translate-y-0.5"
                  }`}
                  style={
                    rating >= star
                      ? { background: reportTheme?.accent, color: reportTheme?.accentContrast }
                      : {
                          background: reportTheme?.surfaceElevated,
                          color: reportTheme?.textSecondary,
                          border: `1px solid ${reportTheme?.border ?? "#D9E5FA"}`,
                        }
                  }
                >
                  {star}
                </button>
              ))}
            </div>
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Optional review note"
              className="h-12 w-full max-w-sm rounded-xl border px-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              style={{
                borderColor: reportTheme?.borderStrong,
                background: reportTheme?.surfaceElevated,
                color: reportTheme?.textPrimary,
              }}
            />
            <button
              disabled={ratingSubmitting || previewMode}
              className="h-12 rounded-xl px-8 text-sm font-bold tracking-wide shadow-sm transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: reportTheme?.accent,
                color: reportTheme?.accentContrast,
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
            </button>
          </div>
          {ratingMessage ? (
            <p className="mt-3 text-sm text-muted-foreground" style={{ color: reportTheme?.textSecondary }}>{ratingMessage}</p>
          ) : null}
        </section>
      </div>

      {showGoTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 rounded-full border border-border/70 bg-card/95 px-4 py-2 text-xs font-semibold shadow-md backdrop-blur-md transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary md:right-24"
          aria-label="Go to top"
          style={{
            borderColor: reportTheme?.borderStrong,
            background: reportTheme?.surfaceElevated,
            color: reportTheme?.textPrimary,
          }}
        >
          Top
        </button>
      ) : null}
    </>
  );
}
