import { useEffect, useState } from "react";
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from "../types/expense";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../api/expenseApi";
import type { CategoryResponse } from "../types/category";
import { getCategories } from "../api/categoryApi";
import ExpenseForm from "../components/ExpenseForm";
import EditExpenseForm from "../components/EditExpenseForm";
import Navbar from "../components/Navbar";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 10;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortBy, setSortBy] = useState("expenseDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [refreshKey, setRefreshKey] = useState(0);

  const [editingExpense, setEditingExpense] = useState<ExpenseResponse | null>(
    null,
  );

  async function handleDeleteExpense(expenseId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(expenseId);

      setRefreshKey((current) => current + 1);
    } catch {
      setError("Failed to delete expense.");
    }
  }

  async function handleUpdateExpense(
    expenseId: number,
    request: UpdateExpenseRequest,
  ) {
    await updateExpense(expenseId, request);

    setEditingExpense(null);
    setRefreshKey((current) => current + 1);
  }

  async function handleCreateExpense(request: CreateExpenseRequest) {
    await createExpense(request);

    setPage(1);
    setRefreshKey((current) => current + 1);
  }

  useEffect(() => {
    async function loadExpenses() {
      try {
        setLoading(true);
        setError("");

        const result = await getExpenses({
          page,
          pageSize,
          categoryId: categoryId === "" ? undefined : Number(categoryId),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy,
          sortDirection,
        });

        setExpenses(result.items);
        setTotalPages(result.totalPages);
      } catch {
        setError("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, [page, categoryId, startDate, endDate, sortBy, sortDirection, refreshKey]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch {
        setError("Failed to load categories.");
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-50 px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <Navbar />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track your daily expenses.
            </p>
          </div>

          {/* Add Expense */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <ExpenseForm
              categories={categories}
              onSubmit={handleCreateExpense}
            />
          </div>

          {/* Edit Expense */}
          {editingExpense && (
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <EditExpenseForm
                expense={editingExpense}
                categories={categories}
                onSubmit={handleUpdateExpense}
                onCancel={() => setEditingExpense(null)}
              />
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

              <p className="text-sm text-gray-500">
                Filter and sort your expense records.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Categories</option>

                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="expenseDate">Expense Date</option>

                  <option value="amount">Amount</option>

                  <option value="createdAt">Created Date</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Direction
                </label>

                <select
                  value={sortDirection}
                  onChange={(event) => {
                    setSortDirection(event.target.value as "asc" | "desc");
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="desc">Descending</option>

                  <option value="asc">Ascending</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryId("");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your recorded expense transactions.
              </p>
            </div>

            {expenses.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No expenses found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new expense or change your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Description
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white">
                    {expenses.map((expense) => (
                      <tr
                        key={expense.expenseId}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {expense.categoryName}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {expense.description ?? "-"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                          ₱{expense.amount.toFixed(2)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingExpense(expense)}
                              className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteExpense(expense.expenseId)
                              }
                              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </span>

              <button
                type="button"
                disabled={totalPages === 0 || page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
