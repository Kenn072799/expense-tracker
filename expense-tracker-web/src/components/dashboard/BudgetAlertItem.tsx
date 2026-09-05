import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import type { BudgetAlert } from "../../types/budgetAlert";

interface BudgetAlertItemProps {
  alert: BudgetAlert;
  index?: number;
}

export default function BudgetAlertItem({
  alert,
  index = 0,
}: BudgetAlertItemProps) {
  const progressWidth = Math.min(
    Math.max(alert.progressPercentage, 0),
    100,
  );

  const isOverBudget =
    alert.status === "Over Budget";

  const isNearLimit =
    alert.status === "Near Limit";

  const statusClass = isOverBudget
    ? "bg-red-50 text-red-600"
    : isNearLimit
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-600";

  const progressClass = isOverBudget
    ? "bg-red-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-emerald-500";

  const StatusIcon = isOverBudget || isNearLimit
    ? AlertTriangle
    : CheckCircle2;

  return (
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
        duration: 0.3,
        delay: index * 0.06,
        ease: "easeOut",
      }}
      className="px-6 py-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">
            {alert.categoryName}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            ₱
            {alert.spentAmount.toLocaleString(
              "en-PH",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}{" "}
            of ₱
            {alert.budgetAmount.toLocaleString(
              "en-PH",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </p>
        </div>

        <div
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />

          {alert.status}
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
            duration: 0.7,
            delay: 0.1 + index * 0.06,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${progressClass}`}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>
          {alert.progressPercentage.toFixed(1)}% used
        </span>

        <span
          className={
            alert.remainingAmount < 0
              ? "font-medium text-red-600"
              : ""
          }
        >
          Remaining: ₱
          {alert.remainingAmount.toLocaleString(
            "en-PH",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}
        </span>
      </div>

      {isOverBudget && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.25,
          }}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-red-600"
        >
          <AlertTriangle className="h-4 w-4" />

          You are over budget by ₱
          {Math.abs(
            alert.remainingAmount,
          ).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          .
        </motion.p>
      )}

      {isNearLimit && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.25,
          }}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-700"
        >
          <AlertTriangle className="h-4 w-4" />

          You are close to your monthly budget limit.
        </motion.p>
      )}
    </motion.div>
  );
}