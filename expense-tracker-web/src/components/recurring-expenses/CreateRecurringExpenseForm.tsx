import { useMemo, useState } from "react";

import {
  CalendarDays,
  CircleAlert,
  LoaderCircle,
  PhilippinePeso,
  Plus,
  Repeat2,
  Tag,
  Text,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type { CategoryResponse } from "../../types/category";
import type { CreateRecurringExpenseRequest } from "../../types/recurringExpense";

interface Props {
  categories: CategoryResponse[];
  submitting: boolean;

  onCreate: (
    request: CreateRecurringExpenseRequest,
  ) => Promise<void>;

  onCancel: () => void;

  onError: (
    message: string,
  ) => void;
}

export default function CreateRecurringExpenseForm({
  categories,
  submitting,
  onCreate,
  onCancel,
  onError,
}: Props) {
  const [form, setForm] =
    useState<CreateRecurringExpenseRequest>({
      categoryId: 0,
      amount: "",
      description: "",
      frequency: "Monthly",
      startDate: "",
      endDate: null,
    });

  const activeCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.isActive,
      ),
    [categories],
  );

  const isValid =
    form.categoryId !== 0 &&
    form.amount !== "" &&
    Number(form.amount) > 0 &&
    form.startDate !== "" &&
    (!form.endDate ||
      new Date(form.endDate) >=
        new Date(form.startDate));

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (form.categoryId === 0) {
      onError(
        "Please select a category.",
      );
      return;
    }

    if (
      form.amount === "" ||
      Number(form.amount) <= 0
    ) {
      onError(
        "Amount must be greater than zero.",
      );
      return;
    }

    if (!form.startDate) {
      onError(
        "Please select a start date.",
      );
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) <
        new Date(form.startDate)
    ) {
      onError(
        "End date cannot be earlier than start date.",
      );
      return;
    }

    onError("");

    await onCreate({
      ...form,

      categoryId: Number(
        form.categoryId,
      ),

      amount: Number(
        form.amount,
      ),

      endDate:
        form.endDate || null,
    });
  }

  return (
    <motion.form
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onSubmit={handleSubmit}
    >
      {/* Description */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
          <Repeat2 className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Create recurring schedule
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add a bill, subscription,
            rent, or another expense
            that repeats automatically.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label
            htmlFor="recurring-category"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <Tag className="h-4 w-4 text-gray-400" />
            Category
          </label>

          <select
            id="recurring-category"
            value={form.categoryId}
            disabled={
              submitting ||
              activeCategories.length ===
                0
            }
            onChange={(event) =>
              setForm({
                ...form,

                categoryId: Number(
                  event.target.value,
                ),
              })
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            required
          >
            <option
              value={0}
              disabled
            >
              {activeCategories.length ===
              0
                ? "No categories available"
                : "Select a category"}
            </option>

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
            htmlFor="recurring-amount"
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
              id="recurring-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={form.amount}
              disabled={submitting}
              onChange={(event) =>
                setForm({
                  ...form,

                  amount:
                    event.target.value ===
                    ""
                      ? ""
                      : Number(
                          event.target
                            .value,
                        ),
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="recurring-description"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <Text className="h-4 w-4 text-gray-400" />

            Description

            <span className="text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>

          <input
            id="recurring-description"
            type="text"
            maxLength={255}
            placeholder="e.g. Netflix subscription"
            value={
              form.description ?? ""
            }
            disabled={submitting}
            onChange={(event) =>
              setForm({
                ...form,

                description:
                  event.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Frequency */}
        <div>
          <label
            htmlFor="recurring-frequency"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <Repeat2 className="h-4 w-4 text-gray-400" />
            Frequency
          </label>

          <select
            id="recurring-frequency"
            value={form.frequency}
            disabled={submitting}
            onChange={(event) =>
              setForm({
                ...form,

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
            htmlFor="recurring-start-date"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <CalendarDays className="h-4 w-4 text-gray-400" />
            Start Date
          </label>

          <input
            id="recurring-start-date"
            type="date"
            value={form.startDate}
            disabled={submitting}
            onChange={(event) =>
              setForm({
                ...form,

                startDate:
                  event.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="recurring-end-date"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <CalendarDays className="h-4 w-4 text-gray-400" />

            End Date

            <span className="text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>

          <input
            id="recurring-end-date"
            type="date"
            min={
              form.startDate ||
              undefined
            }
            value={
              form.endDate ?? ""
            }
            disabled={submitting}
            onChange={(event) =>
              setForm({
                ...form,

                endDate:
                  event.target.value ||
                  null,
              })
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <p className="mt-1.5 text-xs leading-5 text-gray-400">
            Leave empty to continue
            indefinitely.
          </p>
        </div>
      </div>

      {/* No Categories */}
      <AnimatePresence>
        {activeCategories.length ===
          0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <p className="text-sm leading-5 text-amber-700">
              You need at least one
              active category before
              creating a recurring
              expense.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <motion.button
          type="button"
          onClick={onCancel}
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
          disabled={
            submitting ||
            activeCategories.length ===
              0 ||
            !isValid
          }
          whileHover={
            submitting || !isValid
              ? undefined
              : {
                  y: -1,
                }
          }
          whileTap={
            submitting || !isValid
              ? undefined
              : {
                  scale: 0.97,
                }
          }
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}