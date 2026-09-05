import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import CreateRecurringExpenseForm from "../components/recurring-expenses/CreateRecurringExpenseForm";
import RecurringExpenseCard from "../components/recurring-expenses/RecurringExpenseCard";

import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  updateRecurringExpense,
} from "../api/recurringExpenseApi";

import { getCategories } from "../api/categoryApi";

import type { CategoryResponse } from "../types/category";

import type {
  CreateRecurringExpenseRequest,
  RecurringExpense,
  UpdateRecurringExpenseRequest,
} from "../types/recurringExpense";

export default function RecurringExpensesPage() {
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);

  const [categories, setCategories] =
    useState<CategoryResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [
          recurringResult,
          categoryResult,
        ] = await Promise.all([
          getRecurringExpenses(),
          getCategories(),
        ]);

        if (!cancelled) {
          setRecurringExpenses(
            recurringResult,
          );

          setCategories(
            categoryResult,
          );
        }
      } catch {
        if (!cancelled) {
          setRecurringExpenses([]);
          setCategories([]);

          setError(
            "Unable to load recurring expenses.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshRecurringExpenses() {
    const result =
      await getRecurringExpenses();

    setRecurringExpenses(result);
  }

  async function handleCreate(
    request: CreateRecurringExpenseRequest,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await createRecurringExpense(
        request,
      );

      await refreshRecurringExpenses();

      setShowCreateForm(false);
    } catch {
      setError(
        "Unable to create recurring expense.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(
    recurringExpenseId: number,
    request: UpdateRecurringExpenseRequest,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await updateRecurringExpense(
        recurringExpenseId,
        request,
      );

      await refreshRecurringExpenses();
    } catch {
      setError(
        "Unable to update recurring expense.",
      );

      throw new Error(
        "Unable to update recurring expense.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(
    item: RecurringExpense,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await updateRecurringExpense(
        item.recurringExpenseId,
        {
          categoryId:
            item.categoryId,

          amount:
            item.amount,

          description:
            item.description ?? "",

          frequency:
            item.frequency,

          endDate:
            item.endDate,

          isActive:
            !item.isActive,
        },
      );

      await refreshRecurringExpenses();
    } catch {
      setError(
        "Unable to update recurring expense.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Permanent delete.
  // Generated normal expenses remain in history.
  async function handleDelete(
    recurringExpenseId: number,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await deleteRecurringExpense(
        recurringExpenseId,
      );

      await refreshRecurringExpenses();
    } catch {
      setError(
        "Unable to delete recurring expense.",
      );

      throw new Error(
        "Unable to delete recurring expense.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Recurring Expenses
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage expenses that automatically
                repeat on a schedule.
              </p>
            </div>

            {!showCreateForm && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowCreateForm(true);
                }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add Recurring Expense
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <CreateRecurringExpenseForm
              categories={categories}
              submitting={submitting}
              onCreate={handleCreate}
              onCancel={() => {
                setShowCreateForm(false);
                setError("");
              }}
              onError={setError}
            />
          )}

          {/* Content */}
          {loading ? (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Loading recurring expenses...
              </p>
            </div>
          ) : recurringExpenses.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                No recurring expenses yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create a recurring expense for
                bills, subscriptions, rent, or
                other repeating payments.
              </p>

              {!showCreateForm && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowCreateForm(true);
                  }}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Your First Recurring Expense
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {recurringExpenses.map(
                (item) => (
                  <RecurringExpenseCard
                    key={
                      item.recurringExpenseId
                    }
                    item={item}
                    categories={categories}
                    submitting={submitting}
                    onUpdate={handleUpdate}
                    onToggleActive={
                      handleToggleActive
                    }
                    onDelete={handleDelete}
                    onError={setError}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}