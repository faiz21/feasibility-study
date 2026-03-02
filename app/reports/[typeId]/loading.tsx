export default function ReportTypeLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-44 animate-pulse rounded-md bg-muted" />
      <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
