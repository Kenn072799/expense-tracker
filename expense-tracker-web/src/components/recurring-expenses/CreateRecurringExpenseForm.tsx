import { useState } from "react";

import type { CategoryResponse } from "../../types/category";
import type { CreateRecurringExpenseRequest } from "../../types/recurringExpense";

interface Props {
  categories: CategoryResponse[];
  submitting: boolean;
  onCreate: (request: CreateRecurringExpenseRequest) => Promise<void>;
  onCancel: () => void;
  onError: (message: string) => void;
}

export default function CreateRecurringExpenseForm({
  categories,
  submitting,
  onCreate,
  onCancel,
  onError,
}: Props) {
  const [form, setForm] = useState<CreateRecurringExpenseRequest>({
    categoryId: 0,
    amount: "",
    description: "",
    frequency: "Monthly",
    startDate: "",
    endDate: null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.categoryId === 0) {
      onError("Please select a category.");
      return;
    }

    if (form.amount === "" || Number(form.amount) <= 0) {
      onError("Amount must be greater than zero.");
      return;
    }

    if (!form.startDate) {
      onError("Please select a start date.");
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      onError("End date cannot be earlier than start date.");
      return;
    }

    await onCreate({
      ...form,
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      endDate: form.endDate || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Create Recurring Expense
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a bill, subscription, or other expense that repeats
          automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            required
          >
            <option value={0} disabled>
              Select a category
            </option>

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
            Amount
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>

          <input
            type="text"
            maxLength={255}
            placeholder="e.g. Netflix subscription"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Frequency
          </label>

          <select
            value={form.frequency}
            onChange={(e) =>
              setForm({
                ...form,
                frequency: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Start Date
          </label>

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            End Date
          </label>

          <input
            type="date"
            min={form.startDate || undefined}
            value={form.endDate ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value || null,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <p className="mt-1 text-xs text-gray-400">
            Optional. Leave empty to continue indefinitely.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={submitting || categories.length === 0}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Create"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}