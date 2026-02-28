"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export type SidebarSection = {
  id: string;
  label: string;
};

export function DesignSystemSidebarNav(props: { sections: SidebarSection[] }) {
  const [activeId, setActiveId] = useState<string>(props.sections[0]?.id ?? "");

  const sectionIds = useMemo(
    () => new Set(props.sections.map((s) => s.id)),
    [props.sections],
  );

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ds-section][id]"),
    ).filter((el) => sectionIds.has(el.id));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0),
          );
        const next = visible[0]?.target as HTMLElement | undefined;
        if (next?.id) setActiveId(next.id);
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0.05, 0.2, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <nav aria-label="Design system sections" className="space-y-1">
      <div className="px-3 py-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">
        SECTIONS
      </div>
      {props.sections.map((section) => {
        const isActive = section.id === activeId;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "group flex items-center border-l-2 px-3 py-2 text-sm transition-colors duration-150",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="truncate">{section.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

