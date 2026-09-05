import { motion } from "framer-motion";

import type { BudgetAlert } from "../../types/budgetAlert";

interface MonthlyBudgetCategoriesProps {
  alerts: BudgetAlert[];
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function MonthlyBudgetCategories({
  alerts,
}: MonthlyBudgetCategoriesProps) {
  const visibleAlerts = [...alerts]
    .sort((a, b) => b.progressPercentage - a.progressPercentage)
    .slice(0, 4);

  const remainingCount = Math.max(alerts.length - visibleAlerts.length, 0);

  return (
    <div className="mt-7 border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Spending by category
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Categories closest to their limit appear first.
          </p>
        </div>

        {remainingCount > 0 && (
          <span className="text-xs font-medium text-emerald-200">
            +{remainingCount} more {remainingCount === 1 ? "category" : "categories"}
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {visibleAlerts.map((alert, index) => {
          const progressWidth = Math.min(
            Math.max(alert.progressPercentage, 0),
            100,
          );
          const normalizedStatus = alert.status.toLowerCase();
          const isOverBudget = normalizedStatus.includes("over");
          const isNearLimit = normalizedStatus.includes("near");
          const statusClass = isOverBudget
            ? "bg-rose-400/15 text-rose-200"
            : isNearLimit
              ? "bg-amber-400/15 text-amber-200"
              : "bg-emerald-400/15 text-emerald-200";
          const progressClass = isOverBudget
            ? "bg-rose-400"
            : isNearLimit
              ? "bg-amber-400"
              : "bg-emerald-400";

          return (
            <motion.div
              key={alert.budgetId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-white">
                  {alert.categoryName}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${statusClass}`}
                >
                  {alert.status}
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    {currencyFormatter.format(alert.spentAmount)}
                  </span>{" "}
                  of {currencyFormatter.format(alert.budgetAmount)}
                </p>

                <span className="text-xs font-semibold text-white">
                  {alert.progressPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.65, delay: 0.2 + index * 0.05 }}
                  className={`h-full rounded-full ${progressClass}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
