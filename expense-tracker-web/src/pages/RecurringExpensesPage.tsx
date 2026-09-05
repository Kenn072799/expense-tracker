import { useEffect, useState } from "react";

import { CircleAlert, Plus, Repeat2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


import CreateRecurringExpenseModal from "../components/recurring-expenses/CreateRecurringExpenseModal";
import RecurringExpenseCard from "../components/recurring-expenses/RecurringExpenseCard";

import AnimatedPage from "../components/ui/AnimatedPage";
import PageContainer from "../components/ui/PageContainer";

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
import Skeleton from "../components/ui/Skeleton";

export default function RecurringExpensesPage() {
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const [recurringResult, categoryResult] = await Promise.all([
          getRecurringExpenses(),
          getCategories(),
        ]);

        if (!cancelled) {
          setRecurringExpenses(recurringResult);

          setCategories(categoryResult);

          setError("");
        }
      } catch {
        if (!cancelled) {
          setRecurringExpenses([]);
          setCategories([]);

          setError("Unable to load recurring expenses.");
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
    const result = await getRecurringExpenses();

    setRecurringExpenses(result);
  }

  async function handleCreate(request: CreateRecurringExpenseRequest) {
    try {
      setSubmitting(true);
      setError("");

      await createRecurringExpense(request);

      await refreshRecurringExpenses();

      setShowCreateModal(false);
    } catch {
      setError("Unable to create recurring expense.");
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

      await updateRecurringExpense(recurringExpenseId, request);

      await refreshRecurringExpenses();
    } catch {
      setError("Unable to update recurring expense.");

      throw new Error("Unable to update recurring expense.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(item: RecurringExpense) {
    try {
      setSubmitting(true);
      setError("");

      await updateRecurringExpense(item.recurringExpenseId, {
        categoryId: item.categoryId,

        amount: item.amount,

        description: item.description ?? "",

        frequency: item.frequency,

        endDate: item.endDate,

        isActive: !item.isActive,
      });

      await refreshRecurringExpenses();
    } catch {
      setError("Unable to update recurring expense.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(recurringExpenseId: number) {
    try {
      setSubmitting(true);
      setError("");

      await deleteRecurringExpense(recurringExpenseId);

      await refreshRecurringExpenses();
    } catch {
      setError("Unable to delete recurring expense.");

      throw new Error("Unable to delete recurring expense.");
    } finally {
      setSubmitting(false);
    }
  }

  function openCreateModal() {
    setError("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (submitting) {
      return;
    }

    setShowCreateModal(false);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatedPage>
        <PageContainer>
          {/* Header */}
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
            className="mb-8 flex flex-col gap-5 border-b border-slate-200/70 pb-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                <Repeat2 className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Recurring
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Manage bills, subscriptions, rent, and other expenses that
                  repeat automatically on a schedule.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={openCreateModal}
              disabled={submitting}
              whileHover={
                submitting
                  ? undefined
                  : {
                      y: -1,
                    }
              }
              whileTap={
                submitting
                  ? undefined
                  : {
                      scale: 0.97,
                    }
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Recurring Expense
            </motion.button>
          </motion.div>

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

                  <p className="mt-0.5 text-sm text-red-600">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <div className="grid gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      <Skeleton className="h-11 w-11 rounded-xl" />

                      <div className="flex-1">
                        <Skeleton className="h-5 w-40" />

                        <Skeleton className="mt-2 h-3 w-28" />
                      </div>
                    </div>

                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <Skeleton className="h-9 w-20 rounded-xl" />
                    <Skeleton className="h-9 w-24 rounded-xl" />
                    <Skeleton className="h-9 w-20 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && recurringExpenses.length === 0 && (
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <Repeat2 className="h-7 w-7 text-violet-600" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                No recurring expenses yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create a recurring expense for bills, subscriptions, rent, or
                other repeating payments.
              </p>

              <motion.button
                type="button"
                onClick={openCreateModal}
                disabled={submitting}
                whileHover={
                  submitting
                    ? undefined
                    : {
                        y: -1,
                      }
                }
                whileTap={
                  submitting
                    ? undefined
                    : {
                        scale: 0.97,
                      }
                }
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Your First Recurring Expense
              </motion.button>
            </motion.div>
          )}

          {/* List */}
          {!loading && recurringExpenses.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.25,
              }}
              className="grid gap-5"
            >
              {recurringExpenses.map((item) => (
                <RecurringExpenseCard
                  key={item.recurringExpenseId}
                  item={item}
                  categories={categories}
                  submitting={submitting}
                  onUpdate={handleUpdate}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  onError={setError}
                />
              ))}
            </motion.div>
          )}
        </PageContainer>

        {/* Create Modal */}
        <CreateRecurringExpenseModal
          isOpen={showCreateModal}
          categories={categories}
          submitting={submitting}
          onCreate={handleCreate}
          onClose={closeCreateModal}
          onError={setError}
        />
      </AnimatedPage>
    </div>
  );
}
