import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asString, asStringList } from "../helpers";

export function DataTableSimple({ block }: CaseStudyBlockComponentProps) {
  const data = block.data;
  const columns = asStringList(data.columns);
  const rows = asArray<unknown[]>(data.rows);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th key={column} className="px-2 py-2 text-left font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-b-0">
                {asArray<unknown>(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-2 text-muted-foreground">{asString(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BlockShell>
  );
}

