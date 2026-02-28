import { cn } from "@/lib/utils";

export function RadarChartPreview(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={cn("h-28 w-full text-foreground", props.className)}
      role="img"
      aria-label="Radar chart preview"
    >
      <rect x="0" y="0" width="240" height="160" fill="none" />
      {/* grid */}
      {["0.12", "0.18", "0.26"].map((opacity, i) => (
        <polygon
          key={i}
          points="120,24 176,56 176,104 120,136 64,104 64,56"
          fill="none"
          stroke="currentColor"
          strokeOpacity={opacity}
          transform={`scale(${1 - i * 0.18}) translate(${(i * 0.18 * 120) / (1 - i * 0.18)}, ${(i * 0.18 * 80) / (1 - i * 0.18)})`}
        />
      ))}
      {/* axes */}
      {[
        [120, 24, 120, 136],
        [176, 56, 64, 104],
        [176, 104, 64, 56],
      ].map((l, i) => (
        <line
          key={i}
          x1={l[0]}
          y1={l[1]}
          x2={l[2]}
          y2={l[3]}
          stroke="currentColor"
          strokeOpacity="0.18"
        />
      ))}
      {/* shape */}
      <polygon
        points="120,42 162,64 150,110 120,120 86,102 92,70"
        fill="hsl(var(--accent-blue))"
        fillOpacity="0.14"
        stroke="hsl(var(--accent-blue))"
        strokeWidth="2"
      />
    </svg>
  );
}

