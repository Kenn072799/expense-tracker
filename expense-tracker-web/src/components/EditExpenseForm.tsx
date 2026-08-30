import { useState } from "react";
import type { CategoryResponse } from "../types/category";
import type { ExpenseResponse, UpdateExpenseRequest } from "../types/expense";

interface EditExpenseFormProps {
  expense: ExpenseResponse;
  categories: CategoryResponse[];
  onSubmit: (expenseId: number, request: UpdateExpenseRequest) => Promise<void>;
  onCancel: () => void;
}

export default function EditExpenseForm({
  expense,
  categories,
  onSubmit,
  onCancel,
}: EditExpenseFormProps) {
  const [categoryId, setCategoryId] = useState(expense.categoryId.toString());

  const [amount, setAmount] = useState(expense.amount.toString());

  const [description, setDescription] = useState(expense.description ?? "");

  const [expenseDate, setExpenseDate] = useState(
    expense.expenseDate.split("T")[0],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!expenseDate) {
      setError("Please select an expense date.");
      return;
    }

    const request: UpdateExpenseRequest = {
      categoryId: Number(categoryId),
      amount: Number(amount),
      description: description || undefined,
      expenseDate,
    };

    try {
      setLoading(true);

      await onSubmit(expense.expenseId, request);
    } catch {
      setError("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Edit Expense</h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the selected expense.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Expense Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Expense Date
          </label>

          <input
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>

          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
