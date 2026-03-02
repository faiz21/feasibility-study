import type { ReactNode } from "react";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type IconBulletIntroProps = {
  title?: string;
  icon?: ReactNode;
  bullets: string[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function IconBulletIntro({
  title = "Sales Analysis",
  icon,
  bullets,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 12 },
  className,
}: IconBulletIntroProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("icon-bullet-intro", colors),
    ...typographyVars("icon-bullet-intro", typography),
  };
  if (bullets.length === 0) return null;

  return (
    <section
      className={cn(spanClassName(gridSpan), "grid grid-cols-12 gap-4", className)}
      style={style}
    >
      <div className="col-span-12 flex flex-col items-center justify-center md:col-span-4">
        <span className="inline-flex h-28 w-28 items-center justify-center rounded-full border-4 border-[var(--icon-bullet-intro-primary)] text-[var(--icon-bullet-intro-primary)]">
          {icon ?? <MonetizationOnOutlinedIcon sx={{ fontSize: 56 }} aria-hidden="true" />}
        </span>
        <h3
          className="mt-4 text-center font-black leading-tight text-[var(--icon-bullet-intro-text)] md:text-6xl"
          style={{
            fontFamily: "var(--icon-bullet-intro-font-family)",
            fontSize: "var(--icon-bullet-intro-title-size, 3rem)",
          }}
        >
          {title}
        </h3>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <span className="text-8xl leading-none text-[var(--icon-bullet-intro-primary)]" aria-hidden="true">
            {"}"}
          </span>
          <ul className="space-y-4 pt-2">
            {bullets.map((bullet, index) => (
              <li
                key={`${bullet}-${index}`}
                className="list-disc leading-tight text-[var(--icon-bullet-intro-text)] md:text-[2.1rem]"
                style={{
                  fontFamily: "var(--icon-bullet-intro-font-family)",
                  fontSize: "var(--icon-bullet-intro-body-size, 1.9rem)",
                }}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
