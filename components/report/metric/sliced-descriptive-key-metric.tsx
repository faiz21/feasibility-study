import type { CSSProperties, ReactNode } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import { cn } from "@/lib/utils";
import {
  paletteVars,
  resolveReportColorTokens,
  type ReportColorTokens,
  type ReportPalette,
  typographyVars,
  type ReportTypography,
} from "../report-theme";

type SliceVariant = "left" | "right";
type ToneVariant = "navy" | "charcoal" | "light";

export type KeyMetricItem = {
  icon?: ReactNode;
  value: string;
  label: string;
};

export type SlicedDescriptiveKeyMetricProps = {
  title?: string;
  description: string;
  items: KeyMetricItem[];
  variant?: SliceVariant;
  tone?: ToneVariant;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
};

const TONE_TOKEN_OVERRIDES: Record<ToneVariant, Partial<ReportColorTokens>> = {
  navy: {},
  charcoal: {
    primary: "var(--card-foreground)",
    secondary: "var(--foreground)",
    background: "var(--card-foreground)",
    foreground: "var(--primary-foreground)",
    "section-title": "var(--primary-foreground)",
    "section-body": "var(--muted)",
    "kpi-value": "var(--primary-foreground)",
    "kpi-label": "var(--muted)",
  },
  light: {
    primary: "var(--muted)",
    secondary: "var(--border)",
    background: "var(--card)",
    foreground: "var(--foreground)",
    "section-title": "var(--section-title)",
    "section-body": "var(--section-body)",
    "kpi-value": "var(--foreground)",
    "kpi-label": "var(--muted-foreground)",
  },
};

const DEFAULT_ITEMS: KeyMetricItem[] = [
  {
    icon: <FavoriteBorderIcon sx={{ fontSize: 48 }} aria-hidden="true" />,
    value: "750M",
    label: "The entries recorded",
  },
  {
    icon: <MyLocationOutlinedIcon sx={{ fontSize: 48 }} aria-hidden="true" />,
    value: "200M",
    label: "Scheduled hours",
  },
];

export function SlicedDescriptiveKeyMetric({
  title = "Key metrics",
  description,
  items,
  variant = "left",
  tone = "navy",
  palette,
  colorPicker,
  typography,
}: SlicedDescriptiveKeyMetricProps) {
  const tokens = resolveReportColorTokens(TONE_TOKEN_OVERRIDES[tone], colorPicker ?? palette);
  const themeStyle = {
    ...paletteVars("sdkm", tokens),
    ...typographyVars("sdkm", typography),
  } as CSSProperties;
  const metricItems = items.length ? items : DEFAULT_ITEMS;

  return (
    <article
      className={cn(
        "h-full border border-foreground/10 bg-[var(--sdkm-background)] text-[var(--sdkm-text)]",
        "px-8 py-7 md:px-10 md:py-9",
        variant === "left"
          ? "rounded-r-[56px] rounded-l-none"
          : "rounded-l-[56px] rounded-r-none",
      )}
      style={themeStyle}
    >
      <div className="mx-auto flex h-full w-full max-w-[420px] flex-col gap-8 md:max-w-[460px]">
        <header className="space-y-4">
          <h3 className="font-bold tracking-tight md:text-6xl" style={{ fontFamily: "var(--sdkm-font-family)", fontSize: "var(--sdkm-title-size, 3rem)" }}>{title}</h3>
          <p className="max-w-[16ch] font-medium leading-tight md:text-[2.55rem]" style={{ fontFamily: "var(--sdkm-font-family)", fontSize: "var(--sdkm-body-size, 2.25rem)" }}>
            {description}
          </p>
        </header>

        <ul className="space-y-6" aria-label={`${title} list`}>
          {metricItems.map((item, index) => (
            <li key={`${item.value}-${index}`} className="flex items-center gap-4">
              <span className="shrink-0 text-[var(--sdkm-text)]">
                {item.icon ?? <FavoriteBorderIcon sx={{ fontSize: 48 }} aria-hidden="true" />}
              </span>
              <div>
                <p className="font-bold leading-none md:text-8xl" style={{ fontFamily: "var(--sdkm-font-family)", fontSize: "var(--sdkm-value-size, 4.5rem)" }}>{item.value}</p>
                <p className="mt-1 font-medium leading-tight md:text-5xl" style={{ fontFamily: "var(--sdkm-font-family)", fontSize: "var(--sdkm-label-size, 2.25rem)" }}>{item.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
