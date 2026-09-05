import { useEffect, useState } from "react";

import { CircleAlert, ReceiptText, WalletCards } from "lucide-react";

import Navbar from "../components/Navbar";
import CategoryChart from "../components/CategoryChart";
import MonthlySpendingChart from "../components/MonthlySpendingChart";
import CategorySpendingSection from "../components/reports/CategorySpendingSection";

import { getBudgetAlerts, getDashboard } from "../api/dashboardApi";

import { getCategorySpending, getMonthlySpending } from "../api/reportApi";

import type { DashboardResponse } from "../types/dashboard";
import type { BudgetAlert } from "../types/budgetAlert";

import type {
  CategorySpendingResponse,
  MonthlySpendingResponse,
} from "../types/report";
import type { ExpenseResponse } from "../types/expense";
import { getRecentExpenses } from "../api/expenseApi";
import RecentExpenses from "../components/dashboard/RecentExpenses";

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

  const [reportMonths, setReportMonths] = useState(6);

  const [categoryMonth, setCategoryMonth] = useState(today.getMonth() + 1);

  const [categoryYear, setCategoryYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(true);

  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");

  const [recentExpenses, setRecentExpenses] = useState<ExpenseResponse[]>([]);

  const [recentExpensesLoading, setRecentExpensesLoading] = useState(true);

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
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <CircleAlert className="h-5 w-5 text-red-600" />

            <p className="text-sm text-red-700">
              {error || "Dashboard data is unavailable."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your expenses and monthly budgets.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="Total Expenses"
              value={`₱${dashboard.totalExpenses.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={<WalletCards className="h-5 w-5 text-blue-600" />}
            />

            <SummaryCard
              title="This Month"
              value={`₱${dashboard.thisMonthExpenses.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={<ReceiptText className="h-5 w-5 text-green-600" />}
            />

            <SummaryCard
              title="Transactions"
              value={dashboard.totalTransactions.toString()}
              icon={<ReceiptText className="h-5 w-5 text-violet-600" />}
            />
          </div>

          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Expenses
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest transactions.
              </p>
            </div>

            <RecentExpenses
              expenses={recentExpenses}
              loading={recentExpensesLoading}
            />
          </section>

          <section className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Budget Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monitor your spending against this month's budgets.
              </p>
            </div>

            {budgetAlerts.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500">
                  No budgets created for this month.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {budgetAlerts.map((alert) => (
                  <BudgetAlertItem key={alert.budgetId} alert={alert} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
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
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          </section>

          <CategorySpendingSection
            data={categorySpending}
            loading={categoryLoading}
            month={categoryMonth}
            year={categoryYear}
            onMonthChange={setCategoryMonth}
            onYearChange={setCategoryYear}
          />

          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                All-Time Spending Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare your total spending across all categories.
              </p>
            </div>

            <CategoryChart data={dashboard.categoryBreakdown} />
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BudgetAlertItem({ alert }: { alert: BudgetAlert }) {
  const progressWidth = Math.min(Math.max(alert.progressPercentage, 0), 100);

  const statusClass =
    alert.status === "Over Budget"
      ? "bg-red-50 text-red-600"
      : alert.status === "Near Limit"
        ? "bg-yellow-50 text-yellow-700"
        : "bg-green-50 text-green-600";

  const progressClass =
    alert.status === "Over Budget"
      ? "bg-red-500"
      : alert.status === "Near Limit"
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{alert.categoryName}</h3>

          <p className="mt-1 text-sm text-gray-500">
            ₱
            {alert.spentAmount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            of ₱
            {alert.budgetAmount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
        >
          {alert.status}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${progressClass}`}
          style={{
            width: `${progressWidth}%`,
          }}
        />
      </div>

      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
        <span>{alert.progressPercentage.toFixed(1)}% used</span>

        <span
          className={
            alert.remainingAmount < 0 ? "font-medium text-red-600" : ""
          }
        >
          Remaining: ₱
          {alert.remainingAmount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {alert.status === "Over Budget" && (
        <p className="mt-3 text-sm font-medium text-red-600">
          You are over budget by ₱
          {Math.abs(alert.remainingAmount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          .
        </p>
      )}

      {alert.status === "Near Limit" && (
        <p className="mt-3 text-sm font-medium text-yellow-700">
          You are close to your monthly budget limit.
        </p>
      )}
    </div>
  );
}
