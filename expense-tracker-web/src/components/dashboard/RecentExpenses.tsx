import {
  CalendarDays,
  ReceiptText,
} from "lucide-react";
import { motion } from "framer-motion";

import type { ExpenseResponse } from "../../types/expense";

interface RecentExpensesProps {
  expenses: ExpenseResponse[];
  loading: boolean;
}

export default function RecentExpenses({
  expenses,
  loading,
}: RecentExpensesProps) {
  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading recent expenses...
          </p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
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
        className="flex min-h-48 flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <ReceiptText className="h-6 w-6 text-gray-400" />
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-800">
          No recent expenses
        </p>

        <p className="mt-1 max-w-xs text-sm leading-6 text-gray-500">
          Your latest expenses will appear here once you start recording transactions.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {expenses.map((expense, index) => (
        <motion.div
          key={expense.expenseId}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            ease: "easeOut",
          }}
          whileHover={{
            x: 3,
          }}
          className="group flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="flex min-w-0 items-start gap-3">
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: -3,
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50"
            >
              <ReceiptText className="h-4 w-4 text-blue-600" />
            </motion.div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-gray-900">
                  {expense.description ||
                    expense.categoryName}
                </p>

                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {expense.categoryName}
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                <span>
                  {new Date(
                    expense.expenseDate,
                  ).toLocaleDateString(
                    "en-PH",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:block">
            <span className="text-xs font-medium text-gray-400 sm:hidden">
              Amount
            </span>

            <p className="shrink-0 text-base font-bold tracking-tight text-gray-900">
              ₱
              {expense.amount.toLocaleString(
                "en-PH",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}