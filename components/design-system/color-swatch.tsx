import { cn } from "@/lib/utils";

export function ColorSwatch(props: {
  name: string;
  description?: string;
  sampleClassName: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{props.name}</div>
        {props.description ? (
          <div className="truncate text-xs text-muted-foreground">
            {props.description}
          </div>
        ) : null}
      </div>
      <div
        className={cn(
          "h-10 w-24 shrink-0 rounded-md border shadow-sm",
          props.sampleClassName,
        )}
        aria-label={props.name}
        title={props.name}
      />
    </div>
  );
}

