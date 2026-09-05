import { useEffect, useState } from "react";

import {
  CircleAlert,
  Plus,
  ReceiptText,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import type {
  CreateExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from "../types/expense";

import type { CategoryResponse } from "../types/category";

import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";

import { getCategories } from "../api/categoryApi";

import Modal from "../components/Modal";
import ExpenseForm from "../components/ExpenseForm";
import EditExpenseForm from "../components/EditExpenseForm";

import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseTable from "../components/expenses/ExpenseTable";
import DeleteExpenseModal from "../components/expenses/DeleteExpenseModal";

import AnimatedPage from "../components/ui/AnimatedPage";
import PageContainer from "../components/ui/PageContainer";

import useExpenses from "../hooks/useExpenses";

export default function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    expenses,
    loading,
    error,
    setError,

    page,
    setPage,
    totalPages,

    search,
    setSearch,

    categoryId,
    startDate,
    endDate,

    sortBy,
    sortDirection,

    hasActiveFilters,

    refresh,
    clearFilters,

    changeCategory,
    changeStartDate,
    changeEndDate,
    changeSortBy,
    changeSortDirection,
  } = useExpenses();

  const [categories, setCategories] =
    useState<CategoryResponse[]>([]);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    editingExpense,
    setEditingExpense,
  ] = useState<ExpenseResponse | null>(
    null,
  );

  const [
    expenseToDelete,
    setExpenseToDelete,
  ] = useState<ExpenseResponse | null>(
    null,
  );

  const [deleting, setDeleting] =
    useState(false);

  const createRequested = searchParams.get("create") === "1";

  function closeCreateModal() {
    setShowCreateModal(false);

    if (createRequested) {
      setSearchParams({}, { replace: true });
    }
  }

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        setError(
          "Failed to load categories.",
        );
      });
  }, [setError]);

  async function handleCreate(
    request: CreateExpenseRequest,
  ) {
    try {
      await createExpense(request);

      closeCreateModal();

      setPage(1);

      refresh();
    } catch {
      setError(
        "Failed to create expense.",
      );
    }
  }

  async function handleUpdate(
    expenseId: number,
    request: UpdateExpenseRequest,
  ) {
    try {
      await updateExpense(
        expenseId,
        request,
      );

      setEditingExpense(null);

      refresh();
    } catch {
      setError(
        "Failed to update expense.",
      );
    }
  }

  async function handleDelete() {
    if (!expenseToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deleteExpense(
        expenseToDelete.expenseId,
      );

      setExpenseToDelete(null);

      if (
        expenses.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) => current - 1,
        );
      } else {
        refresh();
      }
    } catch {
      setError(
        "Failed to delete expense.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatedPage>
        <PageContainer className="py-8">
          <div className="mb-8 flex flex-col gap-5 border-b border-slate-200/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 sm:flex"
              >
                <ReceiptText className="h-6 w-6 text-emerald-700" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Expenses
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Manage, search, filter, and track your daily
                  expenses in one place.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              whileHover={{
                y: -1,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md sm:w-auto"
            >
              <Plus className="h-4 w-4" />

              Add Expense
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <CircleAlert className="h-4 w-4 text-red-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 text-sm text-red-600">
                    {error}
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                  whileTap={{
                    scale: 0.9,
                  }}
                  aria-label="Close error"
                  className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 0.05,
              ease: "easeOut",
            }}
          >
            <ExpenseFilters
              search={search}
              categoryId={categoryId}
              startDate={startDate}
              endDate={endDate}
              sortBy={sortBy}
              sortDirection={
                sortDirection
              }
              categories={categories}
              hasActiveFilters={
                hasActiveFilters
              }
              onSearchChange={
                setSearch
              }
              onCategoryChange={
                changeCategory
              }
              onStartDateChange={
                changeStartDate
              }
              onEndDateChange={
                changeEndDate
              }
              onSortByChange={
                changeSortBy
              }
              onSortDirectionChange={
                changeSortDirection
              }
              onClear={clearFilters}
            />
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: 0.1,
              ease: "easeOut",
            }}
          >
            <ExpenseTable
              expenses={expenses}
              loading={loading}
              page={page}
              totalPages={totalPages}
              hasActiveFilters={
                hasActiveFilters
              }
              onPageChange={setPage}
              onEdit={
                setEditingExpense
              }
              onDelete={
                setExpenseToDelete
              }
              onAdd={() =>
                setShowCreateModal(true)
              }
              onClearFilters={
                clearFilters
              }
            />
          </motion.div>
        </PageContainer>
      </AnimatedPage>

      <Modal
        isOpen={showCreateModal || createRequested}
        title="Add Expense"
        onClose={closeCreateModal}
      >
        <ExpenseForm
          categories={categories}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        isOpen={
          editingExpense !== null
        }
        title="Edit Expense"
        onClose={() =>
          setEditingExpense(null)
        }
      >
        {editingExpense && (
          <EditExpenseForm
            expense={
              editingExpense
            }
            categories={categories}
            onSubmit={
              handleUpdate
            }
            onCancel={() =>
              setEditingExpense(null)
            }
          />
        )}
      </Modal>

      <DeleteExpenseModal
        expense={expenseToDelete}
        deleting={deleting}
        onClose={() =>
          setExpenseToDelete(null)
        }
        onConfirm={
          handleDelete
        }
      />
    </div>
  );
}
