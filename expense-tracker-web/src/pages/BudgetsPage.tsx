import { useEffect, useState } from "react";

import {
  CircleAlert,
  LoaderCircle,
  WalletCards,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../api/budgetApi";
import { getCategories } from "../api/categoryApi";

import BudgetCard from "../components/budgets/BudgetCard";
import BudgetPeriodFilter from "../components/budgets/BudgetPeriodFilter";
import CreateBudgetCard from "../components/budgets/CreateBudgetCard";
import DeleteBudgetModal from "../components/budgets/DeleteBudgetModal";

import AnimatedPage from "../components/ui/AnimatedPage";
import PageContainer from "../components/ui/PageContainer";


import type {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../types/budget";
import type { CategoryResponse } from "../types/category";

export default function BudgetsPage() {
  const today = new Date();

  const [month, setMonth] = useState(
    today.getMonth() + 1,
  );

  const [year, setYear] = useState(
    today.getFullYear(),
  );

  const [budgets, setBudgets] = useState<
    Budget[]
  >([]);

  const [categories, setCategories] =
    useState<CategoryResponse[]>([]);

  const [categoryId, setCategoryId] =
    useState(0);

  const [amount, setAmount] =
    useState("");

  const [
    editingBudgetId,
    setEditingBudgetId,
  ] = useState<number | null>(null);

  const [editAmount, setEditAmount] =
    useState("");

  const [
    selectedBudgetForDelete,
    setSelectedBudgetForDelete,
  ] = useState<Budget | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [
    deletingBudgetId,
    setDeletingBudgetId,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [createError, setCreateError] =
    useState("");

  const refreshBudgets = async () => {
    const data = await getBudgets(
      month,
      year,
    );

    setBudgets(data);
  };

  useEffect(() => {
    let cancelled = false;

    const loadBudgets = async () => {
      try {
        setLoading(true);

        const data = await getBudgets(
          month,
          year,
        );

        if (!cancelled) {
          setBudgets(data);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Failed to load budgets.",
          );
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
    const loadCategories =
      async () => {
        try {
          const data =
            await getCategories();

          setCategories(data);

          const firstActiveCategory =
            data.find(
              (category) =>
                category.isActive,
            );

          if (firstActiveCategory) {
            setCategoryId(
              firstActiveCategory.categoryId,
            );
          } else {
            setCategoryId(0);
          }
        } catch {
          setCreateError(
            "Failed to load categories.",
          );
        }
      };

    loadCategories();
  }, []);

  const handleCreateBudget =
    async () => {
      if (categoryId === 0) {
        setCreateError(
          "Please select a category.",
        );
        return;
      }

      if (
        !amount ||
        Number(amount) <= 0
      ) {
        setCreateError(
          "Budget amount must be greater than zero.",
        );
        return;
      }

      try {
        setCreating(true);
        setCreateError("");

        const request: CreateBudgetRequest =
          {
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

  const handleStartEdit = (
    budget: Budget,
  ) => {
    setEditingBudgetId(
      budget.budgetId,
    );

    setEditAmount(
      budget.amount.toString(),
    );

    setError("");
  };

  const handleCancelEdit = () => {
    setEditingBudgetId(null);
    setEditAmount("");
  };

  const handleUpdateBudget =
    async (budgetId: number) => {
      if (
        !editAmount ||
        Number(editAmount) <= 0
      ) {
        setError(
          "Budget amount must be greater than zero.",
        );
        return;
      }

      try {
        setUpdating(true);
        setError("");

        const request: UpdateBudgetRequest =
          {
            amount: Number(editAmount),
          };

        await updateBudget(
          budgetId,
          request,
        );

        setEditingBudgetId(null);
        setEditAmount("");

        await refreshBudgets();
      } catch {
        setError(
          "Failed to update budget.",
        );
      } finally {
        setUpdating(false);
      }
    };

  const handleDeleteBudget =
    async () => {
      if (!selectedBudgetForDelete) {
        return;
      }

      const budgetId =
        selectedBudgetForDelete.budgetId;

      try {
        setDeletingBudgetId(
          budgetId,
        );

        setError("");

        await deleteBudget(
          budgetId,
        );

        if (
          editingBudgetId ===
          budgetId
        ) {
          setEditingBudgetId(null);
          setEditAmount("");
        }

        setSelectedBudgetForDelete(
          null,
        );

        await refreshBudgets();
      } catch {
        setError(
          "Failed to delete budget.",
        );
      } finally {
        setDeletingBudgetId(null);
      }
    };

  const handleMonthChange = (
    value: number,
  ) => {
    setMonth(value);

    setEditingBudgetId(null);
    setEditAmount("");

    setSelectedBudgetForDelete(
      null,
    );
  };

  const handleYearChange = (
    value: number,
  ) => {
    setYear(value);

    setEditingBudgetId(null);
    setEditAmount("");

    setSelectedBudgetForDelete(
      null,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatedPage>
        <PageContainer>
          {/* Page Header */}
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
            className="mb-8 border-b border-slate-200/70 pb-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                <WalletCards className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Budgets
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Set monthly spending
                  limits, monitor your
                  progress, and stay in
                  control of your
                  expenses.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Budget Period */}
          <BudgetPeriodFilter
            month={month}
            year={year}
            onMonthChange={
              handleMonthChange
            }
            onYearChange={
              handleYearChange
            }
          />

          {/* Create Budget */}
          <CreateBudgetCard
            categories={categories}
            categoryId={categoryId}
            amount={amount}
            month={month}
            year={year}
            creating={creating}
            error={createError}
            onCategoryChange={
              setCategoryId
            }
            onAmountChange={
              setAmount
            }
            onCreate={
              handleCreateBudget
            }
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                }}
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3"
              >
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="text-sm font-medium text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <LoaderCircle className="h-6 w-6 animate-spin text-blue-600" />
              </div>

              <p className="mt-4 font-medium text-gray-900">
                Loading budgets...
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Retrieving your budget
                information.
              </p>
            </motion.div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            budgets.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <WalletCards className="h-7 w-7 text-blue-600" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  No budgets yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  You haven't created a
                  budget for this
                  period. Create one
                  above to start
                  tracking your
                  spending.
                </p>
              </motion.div>
            )}

          {/* Budget List */}
          {!loading &&
            budgets.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {budgets.map(
                  (
                    budget,
                    index,
                  ) => (
                    <BudgetCard
                      key={
                        budget.budgetId
                      }
                      budget={budget}
                      index={index}
                      isEditing={
                        editingBudgetId ===
                        budget.budgetId
                      }
                      isUpdating={
                        updating &&
                        editingBudgetId ===
                          budget.budgetId
                      }
                      isDeleting={
                        deletingBudgetId ===
                        budget.budgetId
                      }
                      editAmount={
                        editAmount
                      }
                      onEditAmountChange={
                        setEditAmount
                      }
                      onStartEdit={
                        handleStartEdit
                      }
                      onCancelEdit={
                        handleCancelEdit
                      }
                      onUpdate={
                        handleUpdateBudget
                      }
                      onDelete={(
                        selectedBudget,
                      ) =>
                        setSelectedBudgetForDelete(
                          selectedBudget,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}

          {/* Delete Modal */}
          <DeleteBudgetModal
            budget={
              selectedBudgetForDelete
            }
            deleting={
              deletingBudgetId !== null
            }
            onClose={() =>
              setSelectedBudgetForDelete(
                null,
              )
            }
            onConfirm={
              handleDeleteBudget
            }
          />
        </PageContainer>
      </AnimatedPage>
    </div>
  );
}
