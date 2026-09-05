import { useState } from "react";

import {
  CalendarDays,
  CircleAlert,
  LoaderCircle,
  PhilippinePeso,
  ReceiptText,
  Save,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { CategoryResponse } from "../types/category";

import type {
  ExpenseResponse,
  UpdateExpenseRequest,
} from "../types/expense";

interface EditExpenseFormProps {
  expense: ExpenseResponse;
  categories: CategoryResponse[];
  onSubmit: (
    expenseId: number,
    request: UpdateExpenseRequest,
  ) => Promise<void>;
  onCancel: () => void;
}

export default function EditExpenseForm({
  expense,
  categories,
  onSubmit,
  onCancel,
}: EditExpenseFormProps) {
  const originalCategoryId =
    expense.categoryId.toString();

  const originalAmount =
    expense.amount.toString();

  const originalDescription =
    expense.description ?? "";

  const originalExpenseDate =
    expense.expenseDate.split("T")[0];

  const [categoryId, setCategoryId] =
    useState(originalCategoryId);

  const [amount, setAmount] =
    useState(originalAmount);

  const [description, setDescription] =
    useState(originalDescription);

  const [expenseDate, setExpenseDate] =
    useState(originalExpenseDate);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const hasChanges =
    categoryId !== originalCategoryId ||
    Number(amount) !== Number(originalAmount) ||
    description !== originalDescription ||
    expenseDate !== originalExpenseDate;

  const isValid =
    categoryId !== "" &&
    amount !== "" &&
    Number(amount) > 0 &&
    expenseDate !== "";

  const canSubmit =
    hasChanges &&
    isValid &&
    !loading;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setError(
        "Amount must be greater than 0.",
      );
      return;
    }

    if (!expenseDate) {
      setError(
        "Please select an expense date.",
      );
      return;
    }

    const request: UpdateExpenseRequest = {
      categoryId: Number(categoryId),
      amount: Number(amount),
      description:
        description.trim() || undefined,
      expenseDate,
    };

    try {
      setLoading(true);

      await onSubmit(
        expense.expenseId,
        request,
      );
    } catch {
      setError(
        "Failed to update expense.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex items-start gap-3">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50"
        >
          <ReceiptText className="h-5 w-5 text-blue-600" />
        </motion.div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Expense
            </h2>

            <AnimatePresence>
              {hasChanges && (
                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                >
                  Unsaved changes
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Update the details of your selected expense.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="edit-expense-category"
          label="Category"
          icon={<Tag className="h-4 w-4" />}
        >
          <select
            id="edit-expense-category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(
                event.target.value,
              )
            }
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
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
        </FormField>

        <FormField
          id="edit-expense-amount"
          label="Amount"
          icon={
            <PhilippinePeso className="h-4 w-4" />
          }
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
              ₱
            </span>

            <input
              id="edit-expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amount}
              disabled={loading}
              onChange={(event) =>
                setAmount(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
        </FormField>

        <FormField
          id="edit-expense-date"
          label="Expense Date"
          icon={
            <CalendarDays className="h-4 w-4" />
          }
        >
          <input
            id="edit-expense-date"
            type="date"
            value={expenseDate}
            disabled={loading}
            onChange={(event) =>
              setExpenseDate(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </FormField>

        <FormField
          id="edit-expense-description"
          label="Description"
          icon={
            <ReceiptText className="h-4 w-4" />
          }
          optional
        >
          <input
            id="edit-expense-description"
            type="text"
            value={description}
            disabled={loading}
            placeholder="e.g. Lunch with friends"
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </FormField>
      </div>

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
            className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <p className="text-sm text-red-700">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasChanges && !loading && (
        <p className="mt-5 text-xs text-gray-400">
          Make a change to enable the Save Changes button.
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={loading}
          whileTap={
            loading
              ? undefined
              : { scale: 0.97 }
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={
            canSubmit
              ? { y: -1 }
              : undefined
          }
          whileTap={
            canSubmit
              ? { scale: 0.97 }
              : undefined
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {loading
            ? "Saving Changes..."
            : "Save Changes"}
        </motion.button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}

function FormField({
  id,
  label,
  icon,
  optional = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
      >
        <span className="text-gray-400">
          {icon}
        </span>

        {label}

        {optional && (
          <span className="ml-1 text-xs font-normal text-gray-400">
            Optional
          </span>
        )}
      </label>

      {children}
    </div>
  );
}