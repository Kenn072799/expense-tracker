import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

import type { CategoryExpenseResponse } from "../types/dashboard";

interface CategoryChartProps {
  data: CategoryExpenseResponse[];
}

export default function CategoryChart({
  data,
}: CategoryChartProps) {
  if (data.length === 0) {
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
        className="flex min-h-72 flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-800">
          No expense data available
        </p>

        <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
          Your all-time category spending will appear here once
          you start recording expenses.
        </p>
      </motion.div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  const totalSpent = sortedData.reduce(
    (total, item) =>
      total + item.totalAmount,
    0,
  );

  return (
    <motion.div
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
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            All-time total
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
            ₱
            {totalSpent.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Categories
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            {sortedData.length}
          </p>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={sortedData}
            margin={{
              top: 8,
              right: 8,
              left: -12,
              bottom: 8,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="categoryName"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B7280",
                fontSize: 12,
              }}
              tickMargin={10}
              interval={0}
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
                  return `₱${(
                    amount / 1_000_000
                  ).toFixed(1)}M`;
                }

                if (amount >= 1000) {
                  return `₱${(
                    amount / 1000
                  ).toFixed(0)}k`;
                }

                return `₱${amount}`;
              }}
            />

            <Tooltip
              cursor={{
                fill: "#F9FAFB",
              }}
              content={({
                active,
                payload,
                label,
              }) => {
                if (
                  !active ||
                  !payload ||
                  payload.length === 0
                ) {
                  return null;
                }

                const amount = Number(
                  payload[0]?.value ?? 0,
                );

                const percentage =
                  totalSpent > 0
                    ? (amount / totalSpent) *
                      100
                    : 0;

                return (
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                    <p className="text-xs font-medium text-gray-500">
                      {label}
                    </p>

                    <p className="mt-1 text-base font-bold text-gray-900">
                      ₱
                      {amount.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {percentage.toFixed(1)}% of
                      all-time spending
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="totalAmount"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
              maxBarSize={54}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}