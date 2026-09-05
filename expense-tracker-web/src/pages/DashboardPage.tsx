import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  CircleAlert,
  CreditCard,
  PiggyBank,
  Plus,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import MonthlySpendingChart from "../components/MonthlySpendingChart";

import RecentExpenses from "../components/dashboard/RecentExpenses";
import SummaryCard from "../components/dashboard/SummaryCard";
import MonthlyBudgetCategories from "../components/dashboard/MonthlyBudgetCategories";

import CategorySpendingSection from "../components/reports/CategorySpendingSection";

import { getBudgetAlerts, getDashboard } from "../api/dashboardApi";

import { getCategorySpending, getMonthlySpending } from "../api/reportApi";

import { getRecentExpenses } from "../api/expenseApi";

import type { DashboardResponse } from "../types/dashboard";

import type { BudgetAlert } from "../types/budgetAlert";

import type { ExpenseResponse } from "../types/expense";

import type {
  CategorySpendingResponse,
  MonthlySpendingResponse,
} from "../types/report";

function formatCurrency(value: number) {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <div className="mx-auto max-w-360">
          {/* Header Skeleton */}
          <div className="mb-7 animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200" />

            <div className="mt-3 h-9 w-64 rounded-lg bg-gray-200" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
          </div>

          {/* Hero Skeleton */}
          <div className="animate-pulse rounded-3xl bg-gray-900 p-6 sm:p-8">
            <div className="h-4 w-32 rounded bg-white/10" />

            <div className="mt-4 h-10 w-56 rounded-lg bg-white/10" />

            <div className="mt-3 h-4 w-44 rounded bg-white/10" />

            <div className="mt-8 h-3 w-full rounded-full bg-white/10" />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="h-16 rounded-2xl bg-white/10" />
              <div className="h-16 rounded-2xl bg-white/10" />
              <div className="h-16 rounded-2xl bg-white/10" />
            </div>
          </div>

          {/* Summary Skeletons */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded bg-gray-200" />

                    <div className="mt-4 h-8 w-36 rounded bg-gray-200" />

                    <div className="mt-3 h-3 w-28 rounded bg-gray-100" />
                  </div>

                  <div className="h-11 w-11 rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {Array.from({
              length: 2,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-36 rounded bg-gray-200" />

                <div className="mt-2 h-3 w-48 rounded bg-gray-100" />

                <div className="mt-6 space-y-4">
                  {Array.from({
                    length: 3,
                  }).map((__, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="h-16 rounded-xl bg-gray-100"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const today = new Date();

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  const [monthlySpending, setMonthlySpending] = useState<
    MonthlySpendingResponse[]
  >([]);

  const [categorySpending, setCategorySpending] = useState<
    CategorySpendingResponse[]
  >([]);

  const [recentExpenses, setRecentExpenses] = useState<ExpenseResponse[]>([]);

  const [reportMonths, setReportMonths] = useState(6);

  const [categoryMonth, setCategoryMonth] = useState(today.getMonth() + 1);

  const [categoryYear, setCategoryYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(true);

  const [categoryLoading, setCategoryLoading] = useState(true);

  const [recentExpensesLoading, setRecentExpensesLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Combine all category budgets
   * into one bank-style monthly summary.
   */
  const budgetSummary = useMemo(() => {
    const totalBudget = budgetAlerts.reduce(
      (total, budget) => total + budget.budgetAmount,
      0,
    );

    const totalSpent = budgetAlerts.reduce(
      (total, budget) => total + budget.spentAmount,
      0,
    );

    const remaining = totalBudget - totalSpent;

    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const progressWidth = Math.min(Math.max(percentage, 0), 100);

    return {
      totalBudget,
      totalSpent,
      remaining,
      percentage,
      progressWidth,
    };
  }, [budgetAlerts]);

  const budgetStatus =
    budgetSummary.percentage > 100
      ? "Over budget"
      : budgetSummary.percentage >= 80
        ? "Near limit"
        : "On track";

  const budgetStatusClass =
    budgetSummary.percentage > 100
      ? "bg-red-400/15 text-red-200 ring-red-400/20"
      : budgetSummary.percentage >= 80
        ? "bg-amber-400/15 text-amber-200 ring-amber-400/20"
        : "bg-emerald-400/15 text-emerald-200 ring-emerald-400/20";

  const budgetProgressClass =
    budgetSummary.percentage > 100
      ? "bg-red-400"
      : budgetSummary.percentage >= 80
        ? "bg-amber-400"
        : "bg-emerald-400";

  useEffect(() => {
    let cancelled = false;

    async function loadRecentExpenses() {
      try {
        setRecentExpensesLoading(true);

        const result = await getRecentExpenses(5);

        if (!cancelled) {
          setRecentExpenses(result);
        }
      } catch {
        if (!cancelled) {
          setRecentExpenses([]);
        }
      } finally {
        if (!cancelled) {
          setRecentExpensesLoading(false);
        }
      }
    }

    loadRecentExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setError("");

        const [dashboardResult, budgetAlertsResult] = await Promise.all([
          getDashboard(),
          getBudgetAlerts(),
        ]);

        if (!cancelled) {
          setDashboard(dashboardResult);

          setBudgetAlerts(budgetAlertsResult);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMonthlySpending() {
      try {
        const result = await getMonthlySpending(reportMonths);

        if (!cancelled) {
          setMonthlySpending(result);
        }
      } catch {
        if (!cancelled) {
          setMonthlySpending([]);
        }
      }
    }

    loadMonthlySpending();

    return () => {
      cancelled = true;
    };
  }, [reportMonths]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategorySpending() {
      try {
        setCategoryLoading(true);

        const result = await getCategorySpending(categoryMonth, categoryYear);

        if (!cancelled) {
          setCategorySpending(result);
        }
      } catch {
        if (!cancelled) {
          setCategorySpending([]);
        }
      } finally {
        if (!cancelled) {
          setCategoryLoading(false);
        }
      }
    }

    loadCategorySpending();

    return () => {
      cancelled = true;
    };
  }, [categoryMonth, categoryYear]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-4 py-8 sm:px-6 xl:px-10">
          <div className="mx-auto max-w-360">
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-medium text-red-700">
                  Unable to load dashboard
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error || "Dashboard data is unavailable."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <div className="mx-auto max-w-360">
          {/* Welcome */}
          <motion.div
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
              ease: "easeOut",
            }}
            className="mb-7 border-b border-slate-200/70 pb-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Financial overview
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Hi,{" "}
              {dashboard.firstName
                ? dashboard.firstName.charAt(0).toUpperCase() +
                  dashboard.firstName.slice(1)
                : "User"}
              {" "}👋
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here's your financial overview for this month.
            </p>
          </motion.div>

          {/* Monthly Budget Hero */}
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
              duration: 0.4,
              ease: "easeOut",
            }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-8"
          >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-400">
                      Monthly Budget
                    </p>

                    {budgetAlerts.length > 0 && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${budgetStatusClass}`}
                      >
                        {budgetStatus}
                      </span>
                    )}
                  </div>

                  {budgetAlerts.length === 0 ? (
                    <>
                      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Start budgeting
                      </h2>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                        Create monthly budgets and track how much you're
                        spending across your categories.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-4 text-sm text-gray-400">
                        Remaining this month
                      </p>

                      <h2
                        className={`mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${
                          budgetSummary.remaining < 0
                            ? "text-red-300"
                            : "text-white"
                        }`}
                      >
                        {formatCurrency(budgetSummary.remaining)}
                      </h2>

                      <p className="mt-2 text-sm text-gray-400">
                        {formatCurrency(budgetSummary.totalSpent)} spent of{" "}
                        {formatCurrency(budgetSummary.totalBudget)}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <PiggyBank className="h-6 w-6" />
                </div>
              </div>

              {budgetAlerts.length > 0 && (
                <>
                  {/* Progress */}
                  <div className="mt-8">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-gray-400">
                        Monthly usage
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {budgetSummary.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${budgetSummary.progressWidth}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${budgetProgressClass}`}
                      />
                    </div>
                  </div>

                  {/* Budget Stats */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs text-gray-400">Total budget</p>

                      <p className="mt-1 font-semibold text-white">
                        {formatCurrency(budgetSummary.totalBudget)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs text-gray-400">Total spent</p>

                      <p className="mt-1 font-semibold text-white">
                        {formatCurrency(budgetSummary.totalSpent)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs text-gray-400">Active budgets</p>

                      <p className="mt-1 font-semibold text-white">
                        {budgetAlerts.length}
                      </p>
                    </div>
                  </div>

                  <MonthlyBudgetCategories alerts={budgetAlerts} />
                </>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/expenses?create=1"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Link>

                <Link
                  to="/budgets"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Budgets
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Quick Overview */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="This Month"
              value={formatCurrency(dashboard.thisMonthExpenses)}
              description="Current month spending"
              icon={CreditCard}
              iconClassName="text-emerald-600"
              iconBackgroundClassName="bg-emerald-50"
              index={0}
            />

            <SummaryCard
              title="Transactions"
              value={dashboard.totalTransactions.toLocaleString("en-PH")}
              description="Total recorded expenses"
              icon={ReceiptText}
              iconClassName="text-violet-600"
              iconBackgroundClassName="bg-violet-50"
              index={1}
            />

            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(dashboard.totalExpenses)}
              description="All-time spending"
              icon={WalletCards}
              iconClassName="text-blue-600"
              iconBackgroundClassName="bg-blue-50"
              index={2}
            />
          </div>

          {/* Recent Expenses */}
          <div className="mt-6">
            {/* Recent Expenses */}
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
                duration: 0.35,
                delay: 0.1,
              }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Expenses
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your latest transactions.
                  </p>
                </div>

                <Link
                  to="/expenses"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <RecentExpenses
                expenses={recentExpenses}
                loading={recentExpensesLoading}
              />
            </motion.section>
          </div>

          {/* Monthly Spending */}
          <motion.section
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.35,
            }}
            className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Monthly Spending Trends
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Compare your spending across recent months.
                </p>
              </div>

              <select
                value={reportMonths}
                onChange={(event) =>
                  setReportMonths(Number(event.target.value))
                }
                aria-label="Monthly spending period"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value={3}>Last 3 months</option>

                <option value={6}>Last 6 months</option>

                <option value={12}>Last 12 months</option>
              </select>
            </div>

            <MonthlySpendingChart
              data={monthlySpending}
              months={reportMonths}
            />
          </motion.section>

          {/* Monthly Category Spending */}
          <CategorySpendingSection
            data={categorySpending}
            loading={categoryLoading}
            month={categoryMonth}
            year={categoryYear}
            onMonthChange={setCategoryMonth}
            onYearChange={setCategoryYear}
          />
        </div>
      </main>
    </div>
  );
}
