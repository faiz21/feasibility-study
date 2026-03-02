import type { ReactNode } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type IconTextNarrativeProps = {
  title?: string;
  body: string;
  icon?: ReactNode;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function IconTextNarrative({
  title = "New Clients",
  body,
  icon,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: IconTextNarrativeProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("icon-text-narrative", colors),
    ...typographyVars("icon-text-narrative", typography),
  };

  return (
    <article className={cn(spanClassName(gridSpan), "grid grid-cols-[auto_1fr] gap-4", className)} style={style}>
      <span className="inline-flex h-24 w-24 items-center justify-center text-[var(--icon-text-narrative-primary)] md:h-28 md:w-28">
        {icon ?? <PersonOutlineOutlinedIcon sx={{ fontSize: 76 }} aria-hidden="true" />}
      </span>
      <div>
        <h4
          className="font-black text-[var(--icon-text-narrative-text)] md:text-6xl"
          style={{
            fontFamily: "var(--icon-text-narrative-font-family)",
            fontSize: "var(--icon-text-narrative-title-size, 3rem)",
          }}
        >
          {title}
        </h4>
        <p
          className="mt-2 leading-tight text-[var(--icon-text-narrative-text)] md:text-[2.1rem]"
          style={{
            fontFamily: "var(--icon-text-narrative-font-family)",
            fontSize: "var(--icon-text-narrative-body-size, 1.9rem)",
          }}
        >
          {body}
        </p>
      </div>
    </article>
  );
}
