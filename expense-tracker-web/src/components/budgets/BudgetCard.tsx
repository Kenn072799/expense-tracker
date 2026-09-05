import {
  CalendarDays,
  CircleAlert,
  LoaderCircle,
  Pencil,
  PhilippinePeso,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Budget } from "../../types/budget";

interface BudgetCardProps {
  budget: Budget;
  index: number;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editAmount: string;

  onEditAmountChange: (amount: string) => void;
  onStartEdit: (budget: Budget) => void;
  onCancelEdit: () => void;
  onUpdate: (budgetId: number) => void;
  onDelete: (budget: Budget) => void;
}

export default function BudgetCard({
  budget,
  index,
  isEditing,
  isUpdating,
  isDeleting,
  editAmount,
  onEditAmountChange,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: BudgetCardProps) {
  const progressWidth = Math.min(
    Math.max(budget.progressPercentage, 0),
    100,
  );

  const isOverBudget =
    budget.progressPercentage > 100;

  const isNearLimit =
    budget.progressPercentage >= 80 &&
    budget.progressPercentage <= 100;

  const period = new Date(
    budget.year,
    budget.month - 1,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function formatCurrency(value: number) {
    return value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const statusText = isOverBudget
    ? "Over budget"
    : isNearLimit
      ? "Near limit"
      : "On track";

  const statusClassName = isOverBudget
    ? "bg-red-50 text-red-700"
    : isNearLimit
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  const progressClassName = isOverBudget
    ? "bg-red-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-blue-500";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      whileHover={{
        y: -2,
      }}
      className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">
            {budget.categoryName}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
            {period}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName}`}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Budget used
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {budget.progressPercentage.toFixed(1)}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Remaining
            </p>

            <p
              className={`mt-1 font-semibold ${
                budget.remainingAmount < 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              ₱
              {formatCurrency(
                budget.remainingAmount,
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progressWidth}%`,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1 + index * 0.04,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${progressClassName}`}
          />
        </div>

        {isOverBudget && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <p className="text-xs leading-5 text-red-700">
              Over budget by ₱
              {formatCurrency(
                Math.abs(
                  budget.remainingAmount,
                ),
              )}
            </p>
          </div>
        )}

        {isNearLimit && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <p className="text-xs leading-5 text-amber-700">
              You're getting close to your monthly limit.
            </p>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-5">
          <label
            htmlFor={`budget-amount-${budget.budgetId}`}
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <PhilippinePeso className="h-4 w-4 text-gray-400" />
            New Budget Amount
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
              ₱
            </span>

            <input
              id={`budget-amount-${budget.budgetId}`}
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={editAmount}
              disabled={isUpdating}
              onChange={(event) =>
                onEditAmountChange(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Budget
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              ₱{formatCurrency(budget.amount)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Spent
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              ₱
              {formatCurrency(
                budget.spentAmount,
              )}
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="flex gap-2 border-t border-gray-100 pt-4">
          {isEditing ? (
            <>
              <motion.button
                type="button"
                onClick={() =>
                  onUpdate(
                    budget.budgetId,
                  )
                }
                disabled={
                  isUpdating ||
                  editAmount === "" ||
                  Number(editAmount) <= 0
                }
                whileTap={
                  isUpdating
                    ? undefined
                    : { scale: 0.97 }
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isUpdating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {isUpdating
                  ? "Saving..."
                  : "Save"}
              </motion.button>

              <motion.button
                type="button"
                onClick={onCancelEdit}
                disabled={isUpdating}
                whileTap={
                  isUpdating
                    ? undefined
                    : { scale: 0.97 }
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                type="button"
                onClick={() =>
                  onStartEdit(budget)
                }
                whileTap={{
                  scale: 0.97,
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </motion.button>

              <motion.button
                type="button"
                onClick={() =>
                  onDelete(budget)
                }
                disabled={isDeleting}
                whileTap={
                  isDeleting
                    ? undefined
                    : { scale: 0.97 }
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}