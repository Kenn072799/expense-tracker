import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import type { MonthlySpendingResponse } from "../types/report";

interface MonthlySpendingChartProps {
  data: MonthlySpendingResponse[];
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
      label: date.toLocaleString("en-PH", {
        month: "short",
        year: "numeric",
      }),
    };
  });

  const hasSpending = chartData.some(
    (item) => item.totalSpent > 0,
  );

  if (!hasSpending) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="flex min-h-80 flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-800">
          No spending data yet
        </p>

        <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
          Your monthly spending trend will appear here once you
          start recording expenses.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={months}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="h-80 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 8,
            right: 8,
            left: -12,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#6B7280",
              fontSize: 12,
            }}
            tickMargin={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#9CA3AF",
              fontSize: 12,
            }}
            tickFormatter={(value) => {
              const amount = Number(value);

              if (amount >= 1_000_000) {
                return `₱${(amount / 1_000_000).toFixed(1)}M`;
              }

              if (amount >= 1000) {
                return `₱${(amount / 1000).toFixed(0)}k`;
              }

              return `₱${amount}`;
            }}
          />

          <Tooltip
            cursor={{
              fill: "#F9FAFB",
            }}
            content={({ active, payload, label }) => {
              if (
                !active ||
                !payload ||
                payload.length === 0
              ) {
                return null;
              }

              const item = payload[0]
                ?.payload as {
                totalSpent: number;
                transactionCount: number;
              };

              return (
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                  <p className="text-xs font-medium text-gray-500">
                    {label}
                  </p>

                  <p className="mt-1 text-base font-bold text-gray-900">
                    ₱
                    {Number(
                      item.totalSpent,
                    ).toLocaleString(
                      "en-PH",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.transactionCount.toLocaleString(
                      "en-PH",
                    )}{" "}
                    {item.transactionCount === 1
                      ? "transaction"
                      : "transactions"}
                  </p>
                </div>
              );
            }}
          />

          <Bar
            dataKey="totalSpent"
            fill="#2563EB"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}