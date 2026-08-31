import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlySpending } from "../types/report";

interface MonthlySpendingChartProps {
  data: MonthlySpending[];
  months: number;
}

export default function MonthlySpendingChart({
  data,
  months,
}: MonthlySpendingChartProps) {
  const today = new Date();

  const chartData = Array.from({ length: months }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (months - 1 - index),
      1,
    );

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const existing = data.find(
      (item) =>
        item.month === month &&
        item.year === year,
    );

    return {
      month,
      year,
      totalSpent: existing?.totalSpent ?? 0,
      transactionCount: existing?.transactionCount ?? 0,
      label: date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
  });

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip
            formatter={(value) => [
              `₱${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              "Total Spent",
            ]}
          />

          <Bar
            dataKey="totalSpent"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}