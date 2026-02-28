"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReportPage = {
  id: string;
  page_order: number;
  html: string;
  title: string;
};

export function ReportViewer({
  reportId,
  locale,
  pages,
}: {
  reportId: string;
  locale: "en" | "id" | "ja";
  pages: ReportPage[];
}) {
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
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
    const timer = setInterval(async () => {
      if (!activePageId) return;

      const node = refs.current[activePageId];
      const scrollTop = node?.scrollTop ?? window.scrollY;
      const scrollHeight = node?.scrollHeight ?? document.body.scrollHeight;
      const viewport = window.innerHeight;
      const maxScrollPct = Math.min(100, ((scrollTop + viewport) / Math.max(scrollHeight, 1)) * 100);

      await fetch(`/api/reports/${reportId}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportPageId: activePageId,
          locale,
          maxScrollPct,
          deltaSec: 10,
          complete: maxScrollPct >= 90,
        }),
      });

      await fetch(`/api/reports/${reportId}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastPageId: activePageId,
          lastScrollY: window.scrollY,
          lastLocale: locale,
        }),
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [activePageId, locale, reportId]);

  return (
    <div className="space-y-6">
      {sorted.map((page) => (
        <article
          key={page.id}
          id={`page-${page.id}`}
          ref={(el) => {
            refs.current[page.id] = el;
          }}
          className="rounded-xl border border-border/70 bg-card p-5 shadow-soft"
        >
          <h2 className="mb-4 text-xl font-semibold tracking-tight">{page.title}</h2>
          <div className="text-sm leading-6" dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>
      ))}

      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
        <h3 className="mb-3 text-base font-semibold">Rate this report</h3>
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
          <button
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
            onClick={async () => {
              await fetch(`/api/reports/${reportId}/rating`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating }),
              });
            }}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
}
