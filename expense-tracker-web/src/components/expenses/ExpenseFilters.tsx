import {
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

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
    <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Search & Filters
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Find and organize your expense records.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search description..."
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <FilterSelect
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
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
        />

        <FilterDate
          label="End Date"
          value={endDate}
          min={startDate || undefined}
          onChange={onEndDateChange}
        />

        <FilterSelect
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
    </section>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  children: React.ReactNode;
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  children,
  onChange,
}: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  );
}

interface FilterDateProps {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}

function FilterDate({
  label,
  value,
  min,
  onChange,
}: FilterDateProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}