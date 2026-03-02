export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-44 animate-pulse rounded-xl bg-muted" />
        <div className="h-44 animate-pulse rounded-xl bg-muted" />
        <div className="h-44 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
