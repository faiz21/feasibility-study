"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReportPage = {
  id: string;
  page_order: number;
  html: string;
  title: string;
  code?: string;
};

export function ReportViewer({
  reportId,
  locale,
  pages,
  initialResume,
  initialRating,
  previewMode,
}: {
  reportId: string;
  locale: "en" | "id" | "ja";
  pages: ReportPage[];
  initialResume?: {
    lastPageId: string | null;
    lastScrollY: number | null;
  };
  initialRating?: {
    rating: number;
    comment: string;
    hasExisting: boolean;
  };
  previewMode?: boolean;
}) {
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [rating, setRating] = useState(initialRating?.rating ?? 5);
  const [comment, setComment] = useState(initialRating?.comment ?? "");
  const [hasSubmittedRating, setHasSubmittedRating] = useState(Boolean(initialRating?.hasExisting));
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const sorted = useMemo(
    () => [...pages].sort((a, b) => a.page_order - b.page_order),
    [pages],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActivePageId(visible.target.id.replace("page-", ""));
        }
      },
      { threshold: [0.2, 0.6, 0.9] },
    );

    sorted.forEach((page) => {
      const node = refs.current[page.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [sorted]);

  useEffect(() => {
    if (!initialResume?.lastPageId) return;
    const resumeId = initialResume.lastPageId;
    const exists = sorted.some((page) => page.id === resumeId);
    if (!exists) return;
    setActivePageId(resumeId);
    const timer = setTimeout(() => {
      document.getElementById(`page-${resumeId}`)?.scrollIntoView({ behavior: "smooth" });
      if (typeof initialResume.lastScrollY === "number" && initialResume.lastScrollY > 0) {
        window.scrollTo({ top: initialResume.lastScrollY, behavior: "smooth" });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [initialResume?.lastPageId, initialResume?.lastScrollY, sorted]);

  useEffect(() => {
    if (previewMode) return;
    const timer = setInterval(async () => {
      if (!activePageId) return;

      const node = refs.current[activePageId];
      const scrollTop = node?.scrollTop ?? window.scrollY;
      const scrollHeight = node?.scrollHeight ?? document.body.scrollHeight;
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

  return (
    <>
      {sorted.length > 1 && (
        <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-5 group py-4 px-2">
          {sorted.map((page) => {
            const isActive = activePageId === page.id;
            return (
              <button
                key={`nav-${page.id}`}
                onClick={() => {
                  document.getElementById(`page-${page.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 justify-end focus:outline-none relative group/item"
                aria-label={`Scroll to ${page.title}`}
              >
                <span className={`
                      absolute right-8 opacity-0 translate-x-2 pointer-events-none whitespace-nowrap text-xs font-semibold bg-popover/95 border border-border/80 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md transition-all duration-300
                      group-hover:opacity-100 group-hover:translate-x-0
                      ${isActive ? "text-primary border-primary/20" : "text-muted-foreground"}
                  `}>
                  {page.title}
                </span>

                <span
                  className={`
                    inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2 text-[10px] font-bold tracking-wide transition-all duration-300
                    ${isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-primary/40 ring-2 ring-primary/20"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"}
                  `}
                >
                  {page.code ?? `P${page.page_order}`}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      <div className="space-y-10 md:pr-16 relative">
        {sorted.map((page) => (
          <article
            key={page.id}
            id={`page-${page.id}`}
            ref={(el) => {
              refs.current[page.id] = el;
            }}
            className="rounded-2xl border border-border/60 bg-card p-6 md:p-10 shadow-panel transition-all duration-500 hover:shadow-glow scroll-mt-24 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{page.title}</h2>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-accent/50 px-3 py-1 rounded-full">Page {page.page_order}</span>
            </div>
            <div className="text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 transition-colors" dangerouslySetInnerHTML={{ __html: page.html }} />
          </article>
        ))}

        <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-6 md:p-8 shadow-panel relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <h3 className="mb-2 text-xl font-bold tracking-tight">Rate this report</h3>
          <p className="mb-6 text-sm text-muted-foreground">Your feedback helps us improve our reporting quality.</p>
          {previewMode ? (
            <p className="mb-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-foreground">
              Admin preview mode: interaction tracking and rating submission are disabled.
            </p>
          ) : null}
          {lastSyncAt ? (
            <p className="mb-3 text-xs text-muted-foreground">
              Reading progress synced at {lastSyncAt.toLocaleTimeString()}.
            </p>
          ) : null}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex bg-accent/30 rounded-xl p-1 border border-border/50">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-12 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${rating >= star ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}
                >
                  {star}
                </button>
              ))}
            </div>
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Optional review note"
              className="h-12 w-full max-w-sm rounded-xl border border-input bg-card px-3 text-sm"
            />
            <button
              disabled={ratingSubmitting || previewMode}
              className="h-12 rounded-xl bg-foreground px-8 text-sm font-bold tracking-wide text-background shadow-lg transition-transform hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={async () => {
                if (previewMode) return;
                setRatingSubmitting(true);
                setRatingMessage(null);
                try {
                  const response = await fetch(`/api/reports/${reportId}/rating`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rating, comment: comment.trim() || null }),
                  });
                  if (!response.ok) {
                    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
                    setRatingMessage(payload?.error ?? "Failed to submit rating.");
                    return;
                  }
                  setRatingMessage(hasSubmittedRating ? "Rating updated." : "Thank you for your feedback.");
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
            <p className="mt-3 text-sm text-muted-foreground">{ratingMessage}</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
