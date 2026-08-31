import { useEffect, useState } from "react";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../api/budgetApi";
import { getCategories } from "../api/categoryApi";
import type {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../types/budget";
import type { CategoryResponse } from "../types/category";
import Navbar from "../components/Navbar";

export default function BudgetsPage() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [categoryId, setCategoryId] = useState(0);
  const [amount, setAmount] = useState("");

  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");

  const refreshBudgets = async () => {
    const data = await getBudgets(month, year);
    setBudgets(data);
  };

  useEffect(() => {
    let cancelled = false;

    const loadBudgets = async () => {
      try {
        const data = await getBudgets(month, year);

        if (!cancelled) {
          setBudgets(data);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load budgets.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBudgets();

    return () => {
      cancelled = true;
    };
  }, [month, year]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);

        if (data.length > 0) {
          setCategoryId(data[0].categoryId);
        }
      } catch {
        setCreateError("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleCreateBudget = async () => {
    if (categoryId === 0) {
      setCreateError("Please select a category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setCreateError("Budget amount must be greater than zero.");
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const request: CreateBudgetRequest = {
        categoryId,
        amount: Number(amount),
        month,
        year,
      };

      await createBudget(request);

      setAmount("");

      await refreshBudgets();
    } catch {
      setCreateError(
        "Failed to create budget. A budget may already exist for this category.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (budget: Budget) => {
    setEditingBudgetId(budget.budgetId);
    setEditAmount(budget.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingBudgetId(null);
    setEditAmount("");
  };

  const handleUpdateBudget = async (budgetId: number) => {
    if (!editAmount || Number(editAmount) <= 0) {
      setError("Budget amount must be greater than zero.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const request: UpdateBudgetRequest = {
        amount: Number(editAmount),
      };

      await updateBudget(budgetId, request);

      setEditingBudgetId(null);
      setEditAmount("");

      await refreshBudgets();
    } catch {
      setError("Failed to update budget.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingBudgetId(budgetId);
      setError("");

      await deleteBudget(budgetId);

      await refreshBudgets();
    } catch {
      setError("Failed to delete budget.");
    } finally {
      setDeletingBudgetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monthly Budgets</h1>

          <p className="mt-2 text-gray-600">
            Set monthly spending limits and track your progress.
          </p>
        </div>

        {/* Create Budget */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Create Monthly Budget
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                disabled={categories.length === 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              >
                {categories.length === 0 && (
                  <option value={0}>No categories available</option>
                )}

                {categories
                  .filter((category) => category.isActive)
                  .map((category) => (
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
                Budget Amount
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCreateBudget}
                disabled={
                  creating || categories.length === 0 || categoryId === 0
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            The budget will be created for the currently selected month and
            year.
          </p>

          {createError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {createError}
            </div>
          )}
        </div>

        {/* Month and Year Filter */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Month
            </label>

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Year
            </label>

            <input
              type="number"
              min="2000"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Loading budgets...</p>
          </div>
        )}

        {!loading && !error && budgets.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No budgets yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't created a budget for this month.
            </p>
          </div>
        )}

        {!loading && budgets.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const progressWidth = Math.min(
                Math.max(budget.progressPercentage, 0),
                100,
              );

              const isEditing = editingBudgetId === budget.budgetId;

              const isDeleting = deletingBudgetId === budget.budgetId;

              return (
                <div
                  key={budget.budgetId}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {budget.categoryName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(budget.year, budget.month - 1).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <span
                      className={
                        budget.progressPercentage > 100
                          ? "rounded-full bg-red-50 px-2 py-1 text-sm font-medium text-red-600"
                          : "rounded-full bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600"
                      }
                    >
                      {budget.progressPercentage.toFixed(1)}%
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="mb-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        New Budget Amount
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Budget</span>

                        <span className="font-medium text-gray-900">
                          ₱
                          {budget.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Spent</span>

                        <span className="font-medium text-gray-900">
                          ₱
                          {budget.spentAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Remaining</span>

                        <span
                          className={
                            budget.remainingAmount < 0
                              ? "font-medium text-red-600"
                              : "font-medium text-green-600"
                          }
                        >
                          ₱
                          {budget.remainingAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={
                        budget.progressPercentage > 100
                          ? "h-full rounded-full bg-red-500 transition-all"
                          : budget.progressPercentage >= 80
                            ? "h-full rounded-full bg-yellow-500 transition-all"
                            : "h-full rounded-full bg-blue-500 transition-all"
                      }
                      style={{
                        width: `${progressWidth}%`,
                      }}
                    />
                  </div>

                  {budget.progressPercentage > 100 && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      Over budget by ₱
                      {Math.abs(budget.remainingAmount).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  )}

                  {budget.progressPercentage >= 80 &&
                    budget.progressPercentage <= 100 && (
                      <p className="mt-2 text-sm font-medium text-yellow-600">
                        You're close to your budget limit.
                      </p>
                    )}

                  <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateBudget(budget.budgetId)}
                          disabled={updating}
                          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={handleCancelEdit}
                          disabled={updating}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(budget)}
                          className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteBudget(budget.budgetId)}
                          disabled={isDeleting}
                          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
