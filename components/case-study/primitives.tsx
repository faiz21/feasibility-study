import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RichText } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

type BlockShellProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export function BlockShell({ title, subtitle, className, children }: BlockShellProps) {
  return (
    <Card className={cn("border-foreground/10 shadow-none", className)}>
      {title || subtitle ? (
        <CardHeader className="space-y-1">
          {title ? <CardTitle className="text-xl">{title}</CardTitle> : null}
          {subtitle ? <p className="text-base leading-7 text-muted-foreground">{subtitle}</p> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(!title && !subtitle ? "pt-6" : undefined)}>{children}</CardContent>
    </Card>
  );
}

export function RichTextRenderer({ value }: { value: RichText | undefined }) {
  if (!value?.blocks?.length) return null;
  return (
    <div className="space-y-2">
      {value.blocks.map((block, index) => {
        switch (block.t) {
          case "p":
            return <p key={index} className="text-sm leading-relaxed">{block.text}</p>;
          case "ul":
          case "ol": {
            const Tag = block.t;
            return (
              <Tag key={index} className="space-y-1 pl-5 text-sm leading-relaxed list-disc">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </Tag>
            );
          }
          default: {
            const HeadingTag = block.t;
            return <HeadingTag key={index} className="font-semibold tracking-tight">{block.text}</HeadingTag>;
          }
        }
      })}
    </div>
  );
}

export function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border bg-surface-soft/60 p-4 shadow-soft">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
    </div>
  );
}
