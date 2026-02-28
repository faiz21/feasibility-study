import { cn } from "@/lib/utils";

export function DesignSystemSection(props: {
  id?: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={props.id}
      data-ds-section
      className={cn("space-y-3 scroll-mt-24", props.className)}
    >
      <header className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight">{props.title}</h2>
        {props.description ? (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        ) : null}
      </header>
      {props.children}
    </section>
  );
}
