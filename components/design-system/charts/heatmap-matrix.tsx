import { cn } from "@/lib/utils";

export function HeatmapMatrixPreview(props: { className?: string }) {
  const cells = [
    ["hsl(var(--neutral-100))", "hsl(var(--neutral-200))", "hsl(var(--warning))"],
    ["hsl(var(--neutral-200))", "hsl(var(--info))", "hsl(var(--neutral-200))"],
    ["hsl(var(--critical))", "hsl(var(--neutral-200))", "hsl(var(--success))"],
  ];

  return (
    <svg
      viewBox="0 0 200 120"
      className={cn("h-28 w-full", props.className)}
      role="img"
      aria-label="Heatmap matrix preview"
    >
      <rect x="0" y="0" width="200" height="120" fill="none" />
      <g transform="translate(32 18)">
        {cells.map((row, r) =>
          row.map((fill, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * 36}
              y={r * 26}
              width="30"
              height="20"
              rx="4"
              fill={fill}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          )),
        )}
      </g>
      <line
        x1="32"
        y1="96"
        x2="152"
        y2="96"
        stroke="hsl(var(--border))"
      />
      <line
        x1="32"
        y1="18"
        x2="32"
        y2="96"
        stroke="hsl(var(--border))"
      />
    </svg>
  );
}

