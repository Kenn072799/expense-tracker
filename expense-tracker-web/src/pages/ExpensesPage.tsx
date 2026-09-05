import { useEffect, useState } from "react";

import {
  CircleAlert,
  Plus,
  X,
} from "lucide-react";

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

import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import ExpenseForm from "../components/ExpenseForm";
import EditExpenseForm from "../components/EditExpenseForm";

import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseTable from "../components/expenses/ExpenseTable";
import DeleteExpenseModal from "../components/expenses/DeleteExpenseModal";

import useExpenses from "../hooks/useExpenses";

export default function ExpensesPage() {
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

      setShowCreateModal(false);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                My Expenses
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage, search, and track your daily expenses.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />

              Add Expense
            </button>
          </header>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-red-600" />

              <p className="flex-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                aria-label="Close error"
                className="text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

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
        </div>
      </main>

      <Modal
        isOpen={showCreateModal}
        title="Add Expense"
        onClose={() =>
          setShowCreateModal(false)
        }
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