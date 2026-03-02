export type ColorToken = {
  name: string;
  description?: string;
  sampleClassName: string;
};

export const semanticColorTokens: ColorToken[] = [
  {
    name: "background / foreground",
    description: "Base page colors",
    sampleClassName: "bg-background text-foreground border-border",
  },
  {
    name: "card",
    description: "Surfaces (cards, panels)",
    sampleClassName: "bg-card text-card-foreground border-border",
  },
  {
    name: "popover",
    description: "Overlays (menus, tooltips)",
    sampleClassName: "bg-popover text-popover-foreground border-border",
  },
  {
    name: "primary / default",
    description: "Primary action color",
    sampleClassName: "bg-primary text-primary-foreground border-primary/20",
  },
  {
    name: "primary / hover",
    description: "Primary interaction hover state",
    sampleClassName:
      "bg-primary-hover text-primary-foreground border-primary-hover/20",
  },
  {
    name: "primary / active",
    description: "Primary pressed or active state",
    sampleClassName:
      "bg-primary-active text-primary-foreground border-primary-active/20",
  },
  {
    name: "primary / soft",
    description: "Low-emphasis primary background",
    sampleClassName:
      "bg-primary-soft text-primary border-primary-border/30",
  },
  {
    name: "brand / default",
    description: "Machine Vision brand identity color",
    sampleClassName: "bg-brand text-brand-foreground border-brand/20",
  },
  {
    name: "brand / soft",
    description: "Subtle brand-emphasis surface",
    sampleClassName: "bg-brand-soft text-brand border-brand/25",
  },
  {
    name: "accent blue",
    description: "Secondary brand accent",
    sampleClassName:
      "bg-accentBlue text-accentBlue-foreground border-accentBlue/30",
  },
  {
    name: "secondary",
    description: "Soft tinted surfaces and secondary actions",
    sampleClassName: "bg-secondary text-secondary-foreground border-secondary/40",
  },
  {
    name: "muted",
    description: "Subtle surfaces",
    sampleClassName: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  {
    name: "accent",
    description: "Highlight surfaces",
    sampleClassName: "bg-accent text-accent-foreground border-accent-foreground/20",
  },
  {
    name: "error / destructive",
    description: "Error states and destructive actions",
    sampleClassName: "bg-error text-error-foreground border-error/25",
  },
  {
    name: "border / input / ring",
    description: "Form & focus primitives",
    sampleClassName: "bg-background text-foreground border-border ring-1 ring-ring",
  },
  {
    name: "auth shell gradient",
    description: "Light/dark auth shell gradient",
    sampleClassName: "bg-gradient-to-br from-auth-shellStart via-auth-shellMid to-auth-shellEnd",
  },
  {
    name: "auth hero gradient",
    description: "Hero panel gradient for authentication",
    sampleClassName: "bg-gradient-to-br from-auth-heroStart via-auth-heroMid to-auth-heroEnd",
  },
];

export const statusColorTokens: ColorToken[] = [
  {
    name: "success",
    description: "Positive system status",
    sampleClassName: "bg-success text-success-foreground border-success/25",
  },
  {
    name: "warning",
    description: "Warning system status",
    sampleClassName: "bg-warning text-warning-foreground border-warning/25",
  },
  {
    name: "error",
    description: "Error system status",
    sampleClassName: "bg-error text-error-foreground border-error/25",
  },
  {
    name: "info",
    description: "Informational system status",
    sampleClassName: "bg-info text-info-foreground border-info/25",
  },
  {
    name: "critical (alias)",
    description: "Backward-compatible alias of error",
    sampleClassName: "bg-critical text-critical-foreground border-critical/25",
  },
];

export const neutralScaleTokens: ColorToken[] = [
  { name: "neutral-50", sampleClassName: "bg-neutral-50 text-foreground border-neutral-200" },
  { name: "neutral-100", sampleClassName: "bg-neutral-100 text-foreground border-neutral-200" },
  { name: "neutral-200", sampleClassName: "bg-neutral-200 text-foreground border-neutral-300" },
  { name: "neutral-300", sampleClassName: "bg-neutral-300 text-foreground border-neutral-400" },
  { name: "neutral-400", sampleClassName: "bg-neutral-400 text-background border-neutral-500" },
  { name: "neutral-500", sampleClassName: "bg-neutral-500 text-background border-neutral-600" },
  { name: "neutral-600", sampleClassName: "bg-neutral-600 text-background border-neutral-700" },
  { name: "neutral-700", sampleClassName: "bg-neutral-700 text-background border-neutral-800" },
  { name: "neutral-800", sampleClassName: "bg-neutral-800 text-background border-neutral-900" },
  { name: "neutral-900", sampleClassName: "bg-neutral-900 text-background border-neutral-800" },
];

export const mvDefaultBrandPalette = {
  primary: "#1E40AF",
  secondary: "#64748B",
  accent: "#0EA5E9",
  background: "#F8FAFC",
  text: "#0F172A",
} as const;
