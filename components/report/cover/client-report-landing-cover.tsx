"use client";

import { useMemo, useState } from "react";

type ClientReportLandingCoverProps = {
  clientName: string;
  companyDescription?: string | null;
  projectDescription?: string | null;
  objective?: string | null;
  scopes: string[];
  projectPeriodLabel: string;
  logoUrl?: string | null;
  coverPhotoUrl?: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    border: string;
    muted: string;
    "card-foreground": string;
    "muted-foreground": string;
    "cover-background": string;
    "cover-overlay": string;
    "cover-title": string;
    "cover-subtitle": string;
    "section-body": string;
  };
};

function toSafeHttpUrl(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }
  return null;
}

export function ClientReportLandingCover({
  clientName,
  companyDescription,
  projectDescription,
  objective,
  scopes,
  projectPeriodLabel,
  logoUrl,
  coverPhotoUrl,
  colors,
}: ClientReportLandingCoverProps) {
  const resolvedLogoUrl = useMemo(() => toSafeHttpUrl(logoUrl), [logoUrl]);
  const resolvedCoverUrl = useMemo(() => toSafeHttpUrl(coverPhotoUrl), [coverPhotoUrl]);
  const [logoBroken, setLogoBroken] = useState(false);
  const [coverBroken, setCoverBroken] = useState(false);

  const showLogo = Boolean(resolvedLogoUrl) && !logoBroken;
  const showCover = Boolean(resolvedCoverUrl) && !coverBroken;

  return (
    <section
      className="overflow-hidden rounded-2xl border shadow-panel"
      style={{
        borderColor: colors.border,
        background: colors.background,
      }}
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div
          className="relative min-h-[280px] border-b md:min-h-[360px] md:border-b-0 md:border-r"
          style={{ borderColor: colors.border }}
        >
          {showCover ? (
            <img
              src={resolvedCoverUrl as string}
              alt={`${clientName} cover`}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setCoverBroken(true)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(145deg, ${colors["cover-background"]}, ${colors.secondary})`,
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 35%, ${colors["cover-overlay"]} 100%)`,
            }}
          />
          <div className="absolute bottom-4 left-4 right-4">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors["cover-subtitle"] }}
            >
              Feasibility Study Report
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight md:text-3xl" style={{ color: colors["cover-title"] }}>
              {clientName}
            </h1>
          </div>
        </div>

        <div className="space-y-4 p-5 md:p-7" style={{ color: colors.foreground }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                Client
              </p>
              <h2 className="text-xl font-bold">{clientName}</h2>
            </div>
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border p-2"
              style={{ borderColor: colors.border, background: colors["card-foreground"] }}
            >
              {showLogo ? (
                <img
                  src={resolvedLogoUrl as string}
                  alt={`${clientName} logo`}
                  className="h-full w-full object-contain"
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">No logo</span>
              )}
            </div>
          </div>

          <p className="text-sm" style={{ color: colors["section-body"] }}>
            {companyDescription ?? "Machine Vision partner in industrial analytics."}
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Project description:</span>{" "}
              {projectDescription ?? "Feasibility study analysis and reporting package."}
            </p>
            <p>
              <span className="font-semibold">Objective:</span>{" "}
              {objective ?? "Deliver actionable insights and implementation recommendations."}
            </p>
            <div>
              <p className="font-semibold">Scopes:</p>
              {scopes.length > 0 ? (
                <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: colors["muted-foreground"] }}>
                  {scopes.map((scope) => (
                    <li key={scope}>{scope}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: colors["muted-foreground"] }}>-</p>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-3 text-xs" style={{ borderColor: colors.border, background: colors.muted }}>
            <p>This report is created by Machine Vision Global.</p>
            <p className="mt-1">{projectPeriodLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
