import type { ReactNode } from "react";

import {
  CalendarDays,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { CategoryResponse } from "../../types/category";

interface ExpenseFiltersProps {
  search: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  categories: CategoryResponse[];
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortDirectionChange: (
    value: "asc" | "desc",
  ) => void;
  onClear: () => void;
}

export default function ExpenseFilters({
  search,
  categoryId,
  startDate,
  endDate,
  sortBy,
  sortDirection,
  categories,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onSortByChange,
  onSortDirectionChange,
  onClear,
}: ExpenseFiltersProps) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={{
                rotate: -5,
                scale: 1.05,
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50"
            >
              <Filter className="h-5 w-5 text-blue-600" />
            </motion.div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-gray-900">
                  Search & Filters
                </h2>

                <AnimatePresence>
                  {hasActiveFilters && (
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
                      className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      Filters active
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Search, filter, and organize your expense records.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                onClick={onClear}
                initial={{
                  opacity: 0,
                  x: 6,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 6,
                }}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <FilterLabel
              htmlFor="expense-search"
              icon={<Search className="h-3.5 w-3.5" />}
            >
              Search
            </FilterLabel>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="expense-search"
                type="text"
                value={search}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                placeholder="Search description..."
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <AnimatePresence>
                {search && (
                  <motion.button
                    type="button"
                    onClick={() =>
                      onSearchChange("")
                    }
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <FilterSelect
            id="expense-category"
            label="Category"
            value={categoryId}
            onChange={onCategoryChange}
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.name}
              </option>
            ))}
          </FilterSelect>

          <FilterDate
            id="expense-start-date"
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
          />

          <FilterDate
            id="expense-end-date"
            label="End Date"
            value={endDate}
            min={startDate || undefined}
            onChange={onEndDateChange}
          />

          <FilterSelect
            id="expense-sort-by"
            label="Sort By"
            value={sortBy}
            onChange={onSortByChange}
          >
            <option value="expenseDate">
              Expense Date
            </option>

            <option value="amount">
              Amount
            </option>

            <option value="createdAt">
              Created Date
            </option>
          </FilterSelect>

          <FilterSelect
            id="expense-sort-direction"
            label="Direction"
            value={sortDirection}
            onChange={(value) =>
              onSortDirectionChange(
                value as "asc" | "desc",
              )
            }
          >
            <option value="desc">
              Descending
            </option>

            <option value="asc">
              Ascending
            </option>
          </FilterSelect>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 8,
              }}
              transition={{
                duration: 0.2,
              }}
              className="mt-5 flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-3 text-xs text-gray-500"
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />

              <span>
                Showing results based on your current filters.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface FilterLabelProps {
  htmlFor: string;
  icon?: ReactNode;
  children: ReactNode;
}

function FilterLabel({
  htmlFor,
  icon,
  children,
}: FilterLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
    >
      {icon}

      {children}
    </label>
  );
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  children: ReactNode;
  onChange: (value: string) => void;
}

function FilterSelect({
  id,
  label,
  value,
  children,
  onChange,
}: FilterSelectProps) {
  return (
    <div>
      <FilterLabel
        htmlFor={id}
        icon={
          <SlidersHorizontal className="h-3.5 w-3.5" />
        }
      >
        {label}
      </FilterLabel>

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  );
}

interface FilterDateProps {
  id: string;
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}

function FilterDate({
  id,
  label,
  value,
  min,
  onChange,
}: FilterDateProps) {
  return (
    <div>
      <FilterLabel
        htmlFor={id}
        icon={
          <CalendarDays className="h-3.5 w-3.5" />
        }
      >
        {label}
      </FilterLabel>

      <input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}