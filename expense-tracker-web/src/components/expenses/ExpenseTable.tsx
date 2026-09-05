import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";

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
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex min-h-20 items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="font-semibold text-gray-900">
            Expenses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recorded expense transactions.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Updating...
          </div>
        )}
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Category",
                  "Description",
                  "Amount",
                  "Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.expenseId}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
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
  onEdit,
  onDelete,
}: {
  expense: ExpenseResponse;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (expense: ExpenseResponse) => void;
}) {
  return (
    <tr className="transition hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {expense.categoryName}
        </span>
      </td>

      <td className="max-w-xs px-6 py-4 text-sm text-gray-600">
        <p className="truncate">
          {expense.description || "-"}
        </p>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
        ₱
        {expense.amount.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {new Date(
          expense.expenseDate,
        ).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
            title="Edit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition hover:bg-blue-100"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(expense)}
            aria-label="Delete expense"
            title="Delete"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

      <p className="text-sm text-gray-500">
        Loading expenses...
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
    <div className="px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <ReceiptText className="h-6 w-6 text-gray-500" />
      </div>

      <p className="font-semibold text-gray-900">
        No expenses found
      </p>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        {hasActiveFilters
          ? "Try changing or clearing your filters."
          : "Start tracking your spending by adding your first expense."}
      </p>

      <button
        type="button"
        onClick={
          hasActiveFilters
            ? onClearFilters
            : onAdd
        }
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {hasActiveFilters ? (
          <>
            Clear Filters
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Expense
          </>
        )}
      </button>
    </div>
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
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
      <button
        type="button"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page{" "}
        <strong className="text-gray-900">
          {page}
        </strong>{" "}
        of{" "}
        <strong className="text-gray-900">
          {totalPages}
        </strong>
      </span>

      <button
        type="button"
        disabled={
          loading ||
          totalPages === 0 ||
          page >= totalPages
        }
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}