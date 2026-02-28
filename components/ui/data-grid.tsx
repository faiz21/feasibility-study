import { cn } from "@/lib/utils";

export function DataGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border/70", className)}>
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
  return <thead className="bg-muted/50 text-xs text-muted-foreground">{children}</thead>;
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
  return <tr className={cn("border-t border-border/70", className)}>{children}</tr>;
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
    return <th className={cn("px-3 py-2 text-left font-medium", className)}>{children}</th>;
  }
  return <td className={cn("px-3 py-3 align-middle", className)}>{children}</td>;
}
