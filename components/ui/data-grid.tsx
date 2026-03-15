import { cn } from "@/lib/utils";

export function DataGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-[1.15rem] border border-border/80 bg-card/85 shadow-soft", className)}>
      {children}
    </div>
  );
}

export function DataGridTable({
  children,
}: {
  children: React.ReactNode;
}) {
  return <table className="w-full border-collapse text-sm">{children}</table>;
}

export function DataGridHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <thead className="bg-surface-strong/70 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </thead>
  );
}

export function DataGridBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return <tbody>{children}</tbody>;
}

export function DataGridRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tr className={cn("border-t border-border/70 transition-colors hover:bg-surface-soft/60", className)}>{children}</tr>;
}

export function DataGridCell({
  children,
  className,
  header = false,
}: {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}) {
  if (header) {
    return <th className={cn("px-4 py-3 text-left font-semibold", className)}>{children}</th>;
  }
  return <td className={cn("px-4 py-4 align-middle", className)}>{children}</td>;
}
