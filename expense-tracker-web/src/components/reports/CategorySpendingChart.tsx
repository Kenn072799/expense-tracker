import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { CategorySpendingResponse } from "../../types/report";

interface CategorySpendingChartProps {
  data: CategorySpendingResponse[];
  loading?: boolean;
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function CategorySpendingChart({
  data,
  loading = false,
}: CategorySpendingChartProps) {
  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500">
          No spending data for this month.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalSpent"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.categoryId}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `₱${Number(value).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Spent",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.categoryName}
                </p>

                <p className="text-xs text-gray-500">
                  {item.transactionCount} transaction
                  {item.transactionCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
              ₱
              {item.totalSpent.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}