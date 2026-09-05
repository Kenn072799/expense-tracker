import {
  CalendarDays,
  ReceiptText,
} from "lucide-react";

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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <ReceiptText className="h-5 w-5 text-gray-400" />
        </div>

        <p className="mt-3 text-sm font-medium text-gray-700">
          No recent expenses
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Your latest expenses will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {expenses.map((expense) => (
        <div
          key={expense.expenseId}
          className="flex items-center justify-between gap-4 py-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-gray-900">
                {expense.description || expense.categoryName}
              </p>

              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {expense.categoryName}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays className="h-3.5 w-3.5" />

              <span>
                {new Date(
                  expense.expenseDate,
                ).toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="shrink-0 text-sm font-semibold text-gray-900">
            ₱
            {expense.amount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ))}
    </div>
  );
}