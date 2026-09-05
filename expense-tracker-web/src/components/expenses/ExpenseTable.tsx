import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type { ExpenseResponse } from "../../types/expense";

interface ExpenseTableProps {
  expenses: ExpenseResponse[];
  loading: boolean;
  page: number;
  totalPages: number;
  hasActiveFilters: boolean;

  onPageChange: (page: number) => void;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (expense: ExpenseResponse) => void;
  onAdd: () => void;
  onClearFilters: () => void;
}

export default function ExpenseTable({
  expenses,
  loading,
  page,
  totalPages,
  hasActiveFilters,
  onPageChange,
  onEdit,
  onDelete,
  onAdd,
  onClearFilters,
}: ExpenseTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex min-h-20 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <ReceiptText className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Expenses
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Your recorded expense transactions.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {loading && expenses.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                x: 6,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 6,
              }}
              className="flex shrink-0 items-center gap-2 text-xs font-medium text-gray-500 sm:text-sm"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

              <span className="hidden sm:inline">
                Updating...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && expenses.length === 0 ? (
        <LoadingState />
      ) : expenses.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onAdd={onAdd}
          onClearFilters={onClearFilters}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr>
                  {[
                    "Category",
                    "Description",
                    "Amount",
                    "Date",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {expenses.map(
                  (expense, index) => (
                    <ExpenseRow
                      key={expense.expenseId}
                      expense={expense}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {expenses.map(
              (expense, index) => (
                <ExpenseMobileCard
                  key={expense.expenseId}
                  expense={expense}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ),
            )}
          </div>
        </>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={onPageChange}
      />
    </section>
  );
}

function ExpenseRow({
  expense,
  index,
  onEdit,
  onDelete,
}: {
  expense: ExpenseResponse;
  index: number;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (expense: ExpenseResponse) => void;
}) {
  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.035,
        ease: "easeOut",
      }}
      className="group transition-colors hover:bg-gray-50/80"
    >
      <td className="whitespace-nowrap px-6 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {expense.categoryName}
        </span>
      </td>

      <td className="max-w-xs px-6 py-4">
        <p
          title={expense.description || undefined}
          className="truncate text-sm text-gray-600"
        >
          {expense.description || "No description"}
        </p>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <p className="text-sm font-bold tracking-tight text-gray-900">
          ₱
          {expense.amount.toLocaleString(
            "en-PH",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}
        </p>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 text-gray-400" />

          {formatExpenseDate(
            expense.expenseDate,
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex justify-end gap-2">
          <motion.button
            type="button"
            onClick={() => onEdit(expense)}
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.92,
            }}
            aria-label={`Edit ${expense.description || "expense"}`}
            title="Edit expense"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Pencil className="h-4 w-4" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() =>
              onDelete(expense)
            }
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.92,
            }}
            aria-label={`Delete ${expense.description || "expense"}`}
            title="Delete expense"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

function ExpenseMobileCard({
  expense,
  index,
  onEdit,
  onDelete,
}: {
  expense: ExpenseResponse;
  index: number;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (expense: ExpenseResponse) => void;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      className="p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {expense.categoryName}
          </span>

          <p className="mt-3 wrap-break-word text-sm font-medium text-gray-700">
            {expense.description ||
              "No description"}
          </p>
        </div>

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

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <CalendarDays className="h-4 w-4 text-gray-400" />

        {formatExpenseDate(
          expense.expenseDate,
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        <motion.button
          type="button"
          onClick={() => onEdit(expense)}
          whileTap={{
            scale: 0.97,
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </motion.button>

        <motion.button
          type="button"
          onClick={() =>
            onDelete(expense)
          }
          whileTap={{
            scale: 0.97,
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </motion.button>
      </div>
    </motion.article>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

      <p className="mt-4 text-sm font-medium text-gray-700">
        Loading expenses...
      </p>

      <p className="mt-1 text-xs text-gray-400">
        Getting your latest transactions.
      </p>
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  onAdd,
  onClearFilters,
}: {
  hasActiveFilters: boolean;
  onAdd: () => void;
  onClearFilters: () => void;
}) {
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
      className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <ReceiptText className="h-7 w-7 text-gray-400" />
      </div>

      <p className="mt-5 font-semibold text-gray-900">
        {hasActiveFilters
          ? "No matching expenses"
          : "No expenses yet"}
      </p>

      <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
        {hasActiveFilters
          ? "We couldn't find any expenses matching your current filters. Try changing or resetting them."
          : "Start tracking your spending by adding your first expense."}
      </p>

      <motion.button
        type="button"
        onClick={
          hasActiveFilters
            ? onClearFilters
            : onAdd
        }
        whileHover={{
          y: -1,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
      >
        {hasActiveFilters ? (
          "Reset Filters"
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Expense
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

function Pagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:px-6">
      <motion.button
        type="button"
        disabled={page <= 1 || loading}
        onClick={() =>
          onPageChange(page - 1)
        }
        whileTap={
          page > 1 && !loading
            ? { scale: 0.96 }
            : undefined
        }
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
      >
        <ChevronLeft className="h-4 w-4" />

        <span className="hidden sm:inline">
          Previous
        </span>
      </motion.button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Page{" "}
          <span className="font-semibold text-gray-900">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {totalPages}
          </span>
        </p>
      </div>

      <motion.button
        type="button"
        disabled={
          loading ||
          totalPages === 0 ||
          page >= totalPages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
        whileTap={
          page < totalPages && !loading
            ? { scale: 0.96 }
            : undefined
        }
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

function formatExpenseDate(
  expenseDate: string,
) {
  return new Date(
    expenseDate,
  ).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}