import { useState } from "react";

import type { CategoryResponse } from "../../types/category";

import type {
  RecurringExpense,
  UpdateRecurringExpenseRequest,
} from "../../types/recurringExpense";

interface Props {
  item: RecurringExpense;
  categories: CategoryResponse[];
  submitting: boolean;

  onUpdate: (
    recurringExpenseId: number,
    request: UpdateRecurringExpenseRequest,
  ) => Promise<void>;

  onToggleActive: (item: RecurringExpense) => Promise<void>;

  onDelete: (recurringExpenseId: number) => Promise<void>;

  onError: (message: string) => void;
}

export default function RecurringExpenseCard({
  item,
  categories,
  submitting,
  onUpdate,
  onToggleActive,
  onDelete,
  onError,
}: Props) {
  const [editing, setEditing] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [editForm, setEditForm] =
    useState<UpdateRecurringExpenseRequest>({
      categoryId: item.categoryId,
      amount: item.amount,
      description: item.description ?? "",
      frequency: item.frequency,
      endDate: item.endDate,
      isActive: item.isActive,
    });

  function startEditing() {
    setEditForm({
      categoryId: item.categoryId,
      amount: item.amount,
      description: item.description ?? "",
      frequency: item.frequency,
      endDate: item.endDate,
      isActive: item.isActive,
    });

    setEditing(true);
    onError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (editForm.categoryId === 0) {
      onError("Please select a category.");
      return;
    }

    if (editForm.amount <= 0) {
      onError("Amount must be greater than zero.");
      return;
    }

    try {
      await onUpdate(
        item.recurringExpenseId,
        editForm,
      );

      setEditing(false);
    } catch {
      // Parent component already handles the error message.
    }
  }

  async function handleDelete() {
    try {
      await onDelete(
        item.recurringExpenseId,
      );

      setShowDeleteConfirm(false);
    } catch {
      // Parent component already handles the error message.
    }
  }

  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              {item.description ||
                item.categoryName}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {item.categoryName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.isActive
                ? "Active"
                : "Inactive"}
            </span>

            <button
              type="button"
              onClick={startEditing}
              disabled={submitting}
              className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onToggleActive(item)
              }
              disabled={submitting}
              className={`rounded-lg px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                item.isActive
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {item.isActive
                ? "Pause"
                : "Resume"}
            </button>

            <button
              type="button"
              onClick={() => {
                onError("");
                setShowDeleteConfirm(true);
              }}
              disabled={submitting}
              className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">
              Amount
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              ₱
              {item.amount.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Frequency
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {item.frequency}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Next Run
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {new Date(
                item.nextRunDate,
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              End Date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {item.endDate
                ? new Date(
                    item.endDate,
                  ).toLocaleDateString()
                : "No end date"}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500">
            Started{" "}
            {new Date(
              item.startDate,
            ).toLocaleDateString()}
          </p>
        </div>

        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-5 border-t border-gray-100 pt-5"
          >
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Edit Recurring Expense
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      categoryId:
                        Number(
                          e.target.value,
                        ),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.categoryId
                        }
                        value={
                          category.categoryId
                        }
                      >
                        {category.name}
                      </option>
                    ),
                  )}
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
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amount:
                        Number(
                          e.target.value,
                        ),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
                  value={
                    editForm.description ??
                    ""
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description:
                        e.target.value,
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
                  value={editForm.frequency}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      frequency:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Weekly">
                    Weekly
                  </option>

                  <option value="Monthly">
                    Monthly
                  </option>

                  <option value="Yearly">
                    Yearly
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    item.startDate.split(
                      "T",
                    )[0]
                  }
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Start date cannot be changed.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  min={
                    item.startDate.split(
                      "T",
                    )[0]
                  }
                  value={
                    editForm.endDate
                      ? editForm.endDate.split(
                          "T",
                        )[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      endDate:
                        e.target.value ||
                        null,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setEditing(false);
                  onError("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Recurring Expense?
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to
              permanently delete{" "}
              <span className="font-semibold text-gray-900">
                {item.description ||
                  item.categoryName}
              </span>
              ?
            </p>

            <div className="mt-4 rounded-lg bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                This will remove the recurring
                schedule permanently.
              </p>

              <p className="mt-1 text-xs text-yellow-700">
                Expenses already generated from
                this schedule will remain in your
                expense history.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowDeleteConfirm(
                    false,
                  );
                  onError("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}