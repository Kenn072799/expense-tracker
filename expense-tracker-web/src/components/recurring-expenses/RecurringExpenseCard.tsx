import { useState } from "react";

import {
  CalendarDays,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Pause,
  Pencil,
  PhilippinePeso,
  Play,
  Repeat2,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../Modal";
import EditRecurringExpenseModal from "./EditRecurringExpenseModal";

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

  onToggleActive: (
    item: RecurringExpense,
  ) => Promise<void>;

  onDelete: (
    recurringExpenseId: number,
  ) => Promise<void>;

  onError: (
    message: string,
  ) => void;
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
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const title =
    item.description ||
    item.categoryName;

  function formatCurrency(
    value: number,
  ) {
    return value.toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
  }

  function formatDate(
    value: string | null,
  ) {
    if (!value) {
      return "No end date";
    }

    const datePart =
      value.split("T")[0];

    const [year, month, day] =
      datePart
        .split("-")
        .map(Number);

    return new Date(
      year,
      month - 1,
      day,
    ).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  function openEditModal() {
    onError("");
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (submitting) {
      return;
    }

    onError("");
    setShowEditModal(false);
  }

  function openDeleteModal() {
    onError("");
    setShowDeleteConfirm(true);
  }

  function closeDeleteModal() {
    if (submitting) {
      return;
    }

    onError("");
    setShowDeleteConfirm(false);
  }

  async function handleDelete() {
    try {
      await onDelete(
        item.recurringExpenseId,
      );

      setShowDeleteConfirm(false);
    } catch {
      // Parent handles API error.
    }
  }

  return (
    <>
      <motion.article
        layout
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
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  item.isActive
                    ? "bg-violet-50"
                    : "bg-gray-100"
                }`}
              >
                <Repeat2
                  className={`h-5 w-5 ${
                    item.isActive
                      ? "text-violet-600"
                      : "text-gray-400"
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold text-gray-900">
                    {title}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.isActive
                      ? "Active"
                      : "Paused"}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <Tag className="h-4 w-4" />

                  <span className="truncate">
                    {item.categoryName}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                type="button"
                onClick={
                  openEditModal
                }
                disabled={
                  submitting
                }
                whileTap={
                  submitting
                    ? undefined
                    : {
                        scale: 0.96,
                      }
                }
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </motion.button>

              <motion.button
                type="button"
                onClick={() =>
                  onToggleActive(
                    item,
                  )
                }
                disabled={
                  submitting
                }
                whileTap={
                  submitting
                    ? undefined
                    : {
                        scale: 0.96,
                      }
                }
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${
                  item.isActive
                    ? "border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {submitting ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : item.isActive ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}

                {item.isActive
                  ? "Pause"
                  : "Resume"}
              </motion.button>

              <motion.button
                type="button"
                onClick={
                  openDeleteModal
                }
                disabled={
                  submitting
                }
                whileTap={
                  submitting
                    ? undefined
                    : {
                        scale: 0.96,
                      }
                }
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </motion.button>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <PhilippinePeso className="h-4 w-4" />
                Amount
              </div>

              <p className="mt-2 text-lg font-bold tracking-tight text-gray-900">
                ₱
                {formatCurrency(
                  item.amount,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Repeat2 className="h-4 w-4" />
                Frequency
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {item.frequency}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Clock3 className="h-4 w-4" />
                Next Run
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatDate(
                  item.nextRunDate,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <CalendarDays className="h-4 w-4" />
                End Date
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatDate(
                  item.endDate,
                )}
              </p>
            </div>
          </div>

          {/* Started */}
          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <CalendarDays className="h-4 w-4 text-gray-400" />

            <span>
              Started{" "}

              <span className="font-medium text-gray-700">
                {formatDate(
                  item.startDate,
                )}
              </span>
            </span>
          </div>
        </div>
      </motion.article>

      {/* Edit Modal */}
      {showEditModal && (
        <EditRecurringExpenseModal
          key={item.recurringExpenseId}
          item={item}
          categories={categories}
          submitting={submitting}
          onUpdate={onUpdate}
          onError={onError}
          onClose={closeEditModal}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={
          showDeleteConfirm
        }
        title="Delete Recurring Expense"
        maxWidth="max-w-md"
        onClose={
          closeDeleteModal
        }
      >
        <div>
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50"
            >
              <Trash2 className="h-7 w-7 text-red-600" />
            </motion.div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Delete this recurring expense?
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You're about to
              permanently delete{" "}

              <span className="font-semibold text-gray-700">
                {title}
              </span>
              .
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {title}
                </p>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <Repeat2 className="h-3.5 w-3.5" />

                  {item.frequency}
                </div>
              </div>

              <p className="shrink-0 font-bold text-gray-900">
                ₱
                {formatCurrency(
                  item.amount,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-medium text-amber-800">
                The recurring
                schedule will be
                removed permanently.
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Expenses already
                generated from this
                schedule will remain
                in your expense
                history.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <motion.button
              type="button"
              disabled={
                submitting
              }
              onClick={
                closeDeleteModal
              }
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
              type="button"
              disabled={
                submitting
              }
              onClick={
                handleDelete
              }
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
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
}
