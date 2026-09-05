import {
  CalendarDays,
  ChartPie,
} from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <motion.div
            whileHover={{
              rotate: -5,
              scale: 1.05,
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50"
          >
            <ChartPie className="h-5 w-5 text-blue-600" />
          </motion.div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Spending by Category
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
              See where your money went during the selected
              month.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="hidden items-center gap-2 pr-1 text-gray-400 sm:flex">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div>
              <label
                htmlFor="category-spending-month"
                className="sr-only"
              >
                Month
              </label>

              <select
                id="category-spending-month"
                value={month}
                onChange={(event) =>
                  onMonthChange(
                    Number(event.target.value),
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
              >
                {MONTHS.map(
                  (name, index) => (
                    <option
                      key={name}
                      value={index + 1}
                    >
                      {name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="category-spending-year"
                className="sr-only"
              >
                Year
              </label>

              <select
                id="category-spending-year"
                value={year}
                onChange={(event) =>
                  onYearChange(
                    Number(event.target.value),
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
              >
                {years.map(
                  (yearOption) => (
                    <option
                      key={yearOption}
                      value={yearOption}
                    >
                      {yearOption}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      <CategorySpendingChart
        key={`${month}-${year}`}
        data={data}
        loading={loading}
      />
    </motion.section>
  );
}