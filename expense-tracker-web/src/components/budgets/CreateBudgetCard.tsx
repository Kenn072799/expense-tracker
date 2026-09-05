import {
  CircleAlert,
  LoaderCircle,
  PhilippinePeso,
  Plus,
  Tag,
  WalletCards,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type { CategoryResponse } from "../../types/category";

interface CreateBudgetCardProps {
  categories: CategoryResponse[];
  categoryId: number;
  amount: string;
  month: number;
  year: number;
  creating: boolean;
  error: string;

  onCategoryChange: (categoryId: number) => void;
  onAmountChange: (amount: string) => void;
  onCreate: () => void;
}

export default function CreateBudgetCard({
  categories,
  categoryId,
  amount,
  month,
  year,
  creating,
  error,
  onCategoryChange,
  onAmountChange,
  onCreate,
}: CreateBudgetCardProps) {
  const activeCategories = categories.filter(
    (category) => category.isActive,
  );

  const canCreate =
    !creating &&
    activeCategories.length > 0 &&
    categoryId !== 0 &&
    amount !== "" &&
    Number(amount) > 0;

  const selectedPeriod = new Date(
    year,
    month - 1,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
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
      className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <WalletCards className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Create Monthly Budget
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Set a spending limit for a category in{" "}
              <span className="font-medium text-gray-700">
                {selectedPeriod}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <label
              htmlFor="budget-category"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Tag className="h-4 w-4 text-gray-400" />
              Category
            </label>

            <select
              id="budget-category"
              value={categoryId}
              disabled={
                creating ||
                activeCategories.length === 0
              }
              onChange={(event) =>
                onCategoryChange(
                  Number(event.target.value),
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {activeCategories.length === 0 && (
                <option value={0}>
                  No categories available
                </option>
              )}

              {activeCategories.map(
                (category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="budget-amount"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <PhilippinePeso className="h-4 w-4 text-gray-400" />
              Budget Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                ₱
              </span>

              <input
                id="budget-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={amount}
                disabled={creating}
                onChange={(event) =>
                  onAmountChange(
                    event.target.value,
                  )
                }
                placeholder="5,000.00"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-end">
            <motion.button
              type="button"
              onClick={onCreate}
              disabled={!canCreate}
              whileHover={
                canCreate
                  ? { y: -1 }
                  : undefined
              }
              whileTap={
                canCreate
                  ? { scale: 0.97 }
                  : undefined
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none lg:w-auto"
            >
              {creating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}

              {creating
                ? "Creating..."
                : "Create Budget"}
            </motion.button>
          </div>
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

              <p className="text-sm leading-5 text-red-700">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}