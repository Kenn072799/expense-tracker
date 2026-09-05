import {
  CalendarDays,
  ChartPie,
} from "lucide-react";

import CategorySpendingChart from "./CategorySpendingChart";

import type { CategorySpendingResponse } from "../../types/report";

interface CategorySpendingSectionProps {
  data: CategorySpendingResponse[];
  loading: boolean;
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CategorySpendingSection({
  data,
  loading,
  month,
  year,
  onMonthChange,
  onYearChange,
}: CategorySpendingSectionProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 5 },
    (_, index) => currentYear - index,
  );

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <ChartPie className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Spending by Category
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              See where your money went during the selected month.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="hidden h-4 w-4 text-gray-400 sm:block" />

          <select
            value={month}
            onChange={(event) =>
              onMonthChange(Number(event.target.value))
            }
            aria-label="Select month"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {MONTHS.map((name, index) => (
              <option
                key={name}
                value={index + 1}
              >
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(event) =>
              onYearChange(Number(event.target.value))
            }
            aria-label="Select year"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {years.map((yearOption) => (
              <option
                key={yearOption}
                value={yearOption}
              >
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CategorySpendingChart
        data={data}
        loading={loading}
      />
    </section>
  );
}