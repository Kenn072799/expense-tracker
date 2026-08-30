import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { CategoryExpenseResponse } from "../types/dashboard";

interface CategoryChartProps {
  data: CategoryExpenseResponse[];
}

export default function CategoryChart({
  data,
}: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500">
          No expense data available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="categoryName"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) => [
              `₱${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              "Amount",
            ]}
          />

          <Bar
            dataKey="totalAmount"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}