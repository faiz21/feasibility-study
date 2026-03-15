import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  success: {
    wrapper: "border-success/25 bg-success/10 text-success",
    icon: CheckCircle2,
  },
  critical: {
    wrapper: "border-critical/25 bg-critical/10 text-critical",
    icon: AlertCircle,
  },
  warning: {
    wrapper: "border-warning/25 bg-warning/10 text-warning",
    icon: AlertTriangle,
  },
  info: {
    wrapper: "border-info/25 bg-info/10 text-info",
    icon: Info,
  },
} as const;

type StatusBannerProps = {
  tone: keyof typeof toneStyles;
  className?: string;
  children: React.ReactNode;
};

export function StatusBanner({
  tone,
  className,
  children,
}: StatusBannerProps) {
  const Icon = toneStyles[tone].icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[1.15rem] border px-4 py-3 text-sm leading-6",
        toneStyles[tone].wrapper,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
