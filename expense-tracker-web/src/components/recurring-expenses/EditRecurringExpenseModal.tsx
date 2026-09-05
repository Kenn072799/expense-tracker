import { useMemo, useState } from "react";

import {
  CalendarDays,
  CircleAlert,
  LoaderCircle,
  PhilippinePeso,
  Repeat2,
  Save,
  Tag,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../Modal";

import type { CategoryResponse } from "../../types/category";

import type {
  RecurringExpense,
  UpdateRecurringExpenseRequest,
} from "../../types/recurringExpense";

interface Props {
  item: RecurringExpense;
  categories: CategoryResponse[];
  submitting: boolean;

  onClose: () => void;

  onUpdate: (
    recurringExpenseId: number,
    request: UpdateRecurringExpenseRequest,
  ) => Promise<void>;

  onError: (message: string) => void;
}

export default function EditRecurringExpenseModal({
  item,
  categories,
  submitting,
  onClose,
  onUpdate,
  onError,
}: Props) {
  const [editForm, setEditForm] =
    useState<UpdateRecurringExpenseRequest>(() => ({
      categoryId: item.categoryId,
      amount: item.amount,
      description: item.description ?? "",
      frequency: item.frequency,
      endDate: item.endDate,
      isActive: item.isActive,
    }));

  const activeCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.isActive ||
        category.categoryId === item.categoryId,
    );
  }, [categories, item]);

  const startDate =
    item.startDate.split("T")[0];

  const editEndDate =
    editForm.endDate?.split("T")[0] ?? "";

  const isValid =
    editForm.categoryId !== 0 &&
    Number(editForm.amount) > 0 &&
    (!editEndDate ||
      editEndDate >= startDate);

  const hasChanges =
    Number(editForm.categoryId) !==
      Number(item.categoryId) ||
    Number(editForm.amount) !==
      Number(item.amount) ||
    (editForm.description ?? "") !==
      (item.description ?? "") ||
    editForm.frequency !==
      item.frequency ||
    editEndDate !==
      (item.endDate?.split("T")[0] ?? "");

  const canSubmit =
    isValid &&
    hasChanges &&
    !submitting;

async function handleSubmit(
  event: React.FormEvent,
) {
  event.preventDefault();

  // TypeScript guard
  if (!item || !editForm) {
    return;
  }

  if (editForm.categoryId === 0) {
    onError(
      "Please select a category.",
    );
    return;
  }

  if (
    Number(editForm.amount) <= 0
  ) {
    onError(
      "Amount must be greater than zero.",
    );
    return;
  }

  if (
    editEndDate &&
    editEndDate < startDate
  ) {
    onError(
      "End date cannot be earlier than start date.",
    );
    return;
  }

  try {
    onError("");

    const request: UpdateRecurringExpenseRequest = {
      categoryId: Number(
        editForm.categoryId,
      ),

      amount: Number(
        editForm.amount,
      ),

      description:
        editForm.description ?? "",

      frequency:
        editForm.frequency,

      endDate:
        editEndDate || null,

      isActive:
        editForm.isActive,
    };

    await onUpdate(
      item.recurringExpenseId,
      request,
    );

    onClose();
  } catch {
    // Parent handles API error.
  }
}

  function handleClose() {
    if (submitting) {
      return;
    }

    onError("");
    onClose();
  }

  return (
    <Modal
      isOpen={item !== null}
      title="Edit Recurring Expense"
      maxWidth="max-w-2xl"
      onClose={handleClose}
    >
      <form
        onSubmit={handleSubmit}
      >
        {/* Intro */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
            <Repeat2 className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Update recurring schedule
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Change the category,
              amount, frequency, or
              end date for this
              recurring expense.
            </p>
          </div>
        </div>

        {/* Unsaved Changes */}
        {hasChanges && (
          <motion.div
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

            Unsaved changes
          </motion.div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label
              htmlFor={`recurring-edit-category-${item.recurringExpenseId}`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Tag className="h-4 w-4 text-gray-400" />
              Category
            </label>

            <select
              id={`recurring-edit-category-${item.recurringExpenseId}`}
              value={
                editForm.categoryId
              }
              disabled={submitting}
              onChange={(event) =>
                setEditForm({
                  ...editForm,

                  categoryId:
                    Number(
                      event.target.value,
                    ),
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {activeCategories.map(
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

          {/* Amount */}
          <div>
            <label
              htmlFor={`recurring-edit-amount-${item.recurringExpenseId}`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <PhilippinePeso className="h-4 w-4 text-gray-400" />
              Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                ₱
              </span>

              <input
                id={`recurring-edit-amount-${item.recurringExpenseId}`}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={
                  editForm.amount
                }
                disabled={submitting}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,

                    amount:
                      Number(
                        event.target.value,
                      ),
                  })
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor={`recurring-edit-description-${item.recurringExpenseId}`}
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Description{" "}

              <span className="text-xs font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              id={`recurring-edit-description-${item.recurringExpenseId}`}
              type="text"
              maxLength={255}
              value={
                editForm.description ?? ""
              }
              disabled={submitting}
              onChange={(event) =>
                setEditForm({
                  ...editForm,

                  description:
                    event.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Frequency */}
          <div>
            <label
              htmlFor={`recurring-edit-frequency-${item.recurringExpenseId}`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Repeat2 className="h-4 w-4 text-gray-400" />
              Frequency
            </label>

            <select
              id={`recurring-edit-frequency-${item.recurringExpenseId}`}
              value={
                editForm.frequency
              }
              disabled={submitting}
              onChange={(event) =>
                setEditForm({
                  ...editForm,

                  frequency:
                    event.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
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

          {/* Start Date */}
          <div>
            <label
              htmlFor={`recurring-edit-start-${item.recurringExpenseId}`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <CalendarDays className="h-4 w-4 text-gray-400" />
              Start Date
            </label>

            <input
              id={`recurring-edit-start-${item.recurringExpenseId}`}
              type="date"
              value={startDate}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Start date cannot be
              changed.
            </p>
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor={`recurring-edit-end-${item.recurringExpenseId}`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <CalendarDays className="h-4 w-4 text-gray-400" />
              End Date

              <span className="text-xs font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              id={`recurring-edit-end-${item.recurringExpenseId}`}
              type="date"
              min={startDate}
              value={editEndDate}
              disabled={submitting}
              onChange={(event) =>
                setEditForm({
                  ...editForm,

                  endDate:
                    event.target.value ||
                    null,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Leave empty to continue
              indefinitely.
            </p>
          </div>
        </div>

        {/* Validation */}
        {!isValid && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <p className="text-xs leading-5 text-amber-700">
              Enter a valid category,
              amount, and end date
              before saving.
            </p>
          </div>
        )}

        {/* No Changes */}
        {isValid &&
          !hasChanges && (
            <p className="mt-5 text-center text-xs text-gray-400 sm:text-left">
              Make a change to enable
              the Save Changes button.
            </p>
          )}

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <motion.button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            whileTap={
              submitting
                ? undefined
                : {
                    scale: 0.97,
                  }
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={
              canSubmit
                ? {
                    y: -1,
                  }
                : undefined
            }
            whileTap={
              canSubmit
                ? {
                    scale: 0.97,
                  }
                : undefined
            }
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
