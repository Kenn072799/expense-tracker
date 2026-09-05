import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

interface BudgetPeriodFilterProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const months = [
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

export default function BudgetPeriodFilter({
  month,
  year,
  onMonthChange,
  onYearChange,
}: BudgetPeriodFilterProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: 0.05,
        ease: "easeOut",
      }}
      className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <CalendarDays className="h-4.5 w-4.5 text-emerald-700" />
          </div>

          <h2 className="text-sm font-semibold text-slate-900">
            Viewing budget for
          </h2>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2 sm:w-auto sm:grid-cols-[10rem_7rem]">
          <div className="relative">
            <label htmlFor="budget-month" className="sr-only">
              Month
            </label>
            <select
              id="budget-month"
              value={month}
              onChange={(event) => onMonthChange(Number(event.target.value))}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {months.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <label htmlFor="budget-year" className="sr-only">
            Year
          </label>
          <input
            id="budget-year"
            type="number"
            min="2000"
            max={new Date().getFullYear() + 10}
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </motion.section>
  );
}
