import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartPie,
  ReceiptText,
} from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex min-h-72 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading category spending...
          </p>
        </div>
      </div>
    );
  }

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
          <ChartPie className="h-6 w-6 text-blue-600" />
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-800">
          No spending data
        </p>

        <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
          There are no recorded expenses for the selected
          month and year.
        </p>
      </motion.div>
    );
  }

  const totalSpent = data.reduce(
    (total, item) =>
      total + item.totalSpent,
    0,
  );

  const totalTransactions = data.reduce(
    (total, item) =>
      total + item.transactionCount,
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
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      {/* Chart */}
      <div className="relative min-h-72">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="totalSpent"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={105}
              paddingAngle={3}
              cornerRadius={5}
              animationDuration={700}
            >
              {data.map(
                (item, index) => (
                  <Cell
                    key={item.categoryId}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                    stroke="transparent"
                  />
                ),
              )}
            </Pie>

            <Tooltip
              content={({
                active,
                payload,
              }) => {
                if (
                  !active ||
                  !payload ||
                  payload.length === 0
                ) {
                  return null;
                }

                const item = payload[0]
                  ?.payload as CategorySpendingResponse;

                const percentage =
                  totalSpent > 0
                    ? (item.totalSpent /
                        totalSpent) *
                      100
                    : 0;

                return (
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                    <p className="text-xs font-medium text-gray-500">
                      {item.categoryName}
                    </p>

                    <p className="mt-1 text-base font-bold text-gray-900">
                      ₱
                      {item.totalSpent.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        {percentage.toFixed(
                          1,
                        )}
                        %
                      </span>

                      <span>•</span>

                      <span>
                        {
                          item.transactionCount
                        }{" "}
                        {item.transactionCount ===
                        1
                          ? "transaction"
                          : "transactions"}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center value */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="mt-1 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              ₱
              {totalSpent.toLocaleString(
                "en-PH",
                {
                  notation:
                    totalSpent >= 100000
                      ? "compact"
                      : "standard",
                  maximumFractionDigits:
                    totalSpent >= 100000
                      ? 1
                      : 2,
                },
              )}
            </p>

            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-400">
              <ReceiptText className="h-3 w-3" />

              <span>
                {totalTransactions}{" "}
                {totalTransactions === 1
                  ? "transaction"
                  : "transactions"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900">
            Category breakdown
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Ranked by spending amount.
          </p>
        </div>

        <div className="space-y-2">
          {data.map(
            (item, index) => {
              const percentage =
                totalSpent > 0
                  ? (item.totalSpent /
                      totalSpent) *
                    100
                  : 0;

              return (
                <motion.div
                  key={
                    item.categoryId
                  }
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay:
                      index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    x: 3,
                  }}
                  className="rounded-xl px-3 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[
                              index %
                                COLORS.length
                            ],
                        }}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {
                            item.categoryName
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {
                            item.transactionCount
                          }{" "}
                          {item.transactionCount ===
                          1
                            ? "transaction"
                            : "transactions"}{" "}
                          ·{" "}
                          {percentage.toFixed(
                            1,
                          )}
                          %
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                      ₱
                      {item.totalSpent.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percentage}%`,
                      }}
                      transition={{
                        duration: 0.65,
                        delay:
                          0.1 +
                          index *
                            0.05,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-blue-500"
                    />
                  </div>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </motion.div>
  );
}