import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, StatCell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function YearPercentBadgeColumn({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title="Year Percent">
      <div className="grid gap-2 md:grid-cols-6">
        {items.map((item, index) => (
          <StatCell key={index} label={String(item.year ?? "")} value={`${String(item.value)}${asString(data.unit, "%")}`} />
        ))}
      </div>
    </BlockShell>
  );
}

export function ProfitVsExpenseSplit({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const labels = asRecord(data.labels);
  const profit = Number(data.profitPct ?? 0);
  const expense = Number(data.expensePct ?? 0);
  return (
    <BlockShell title="Profit vs Expense">
      <div className="space-y-2">
        <div className="text-sm">
          {asString(labels.profit, "Profit")}: <span className="font-semibold">{profit}%</span>
        </div>
        <div className="text-sm">
          {asString(labels.expense, "Expense")}: <span className="font-semibold">{expense}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${profit}%` }} />
        </div>
      </div>
    </BlockShell>
  );
}

