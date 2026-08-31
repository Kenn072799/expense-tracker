import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBudgetAlerts, getDashboard } from "../api/dashboardApi";
import type { DashboardResponse } from "../types/dashboard";
import type { BudgetAlert } from "../types/budgetAlert";
import CategoryChart from "../components/CategoryChart";
import { getMonthlySpending } from "../api/reportApi";
import type { MonthlySpending } from "../types/report";
import MonthlySpendingChart from "../components/MonthlySpendingChart";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);

  const [reportMonths, setReportMonths] = useState(6);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your expenses and monthly budgets.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₱
                {dashboard.totalExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm font-medium text-gray-500">This Month</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₱
                {dashboard.thisMonthExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm font-medium text-gray-500">Transactions</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {dashboard.totalTransactions}
              </p>
            </div>
          </div>

          {/* Budget Alerts */}
          <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
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
                {budgetAlerts.map((alert) => {
                  const progressWidth = Math.min(
                    Math.max(alert.progressPercentage, 0),
                    100,
                  );

                  return (
                    <div key={alert.budgetId} className="px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {alert.categoryName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            ₱
                            {alert.spentAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            of ₱
                            {alert.budgetAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <span
                          className={
                            alert.status === "Over Budget"
                              ? "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                              : alert.status === "Near Limit"
                                ? "rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700"
                                : "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                          }
                        >
                          {alert.status}
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={
                            alert.status === "Over Budget"
                              ? "h-full rounded-full bg-red-500 transition-all"
                              : alert.status === "Near Limit"
                                ? "h-full rounded-full bg-yellow-500 transition-all"
                                : "h-full rounded-full bg-green-500 transition-all"
                          }
                          style={{
                            width: `${progressWidth}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
                        <span>{alert.progressPercentage.toFixed(1)}% used</span>

                        <span
                          className={
                            alert.remainingAmount < 0
                              ? "font-medium text-red-600"
                              : ""
                          }
                        >
                          Remaining: ₱
                          {alert.remainingAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {alert.status === "Over Budget" && (
                        <p className="mt-3 text-sm font-medium text-red-600">
                          You are over budget by ₱
                          {Math.abs(alert.remainingAmount).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
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
                })}
              </div>
            )}
          </div>

          {/* Monthly Spending Trends */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
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
                onChange={(e) => setReportMonths(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
          </div>

          {/* Spending Overview */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Spending Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare your total spending across categories.
              </p>
            </div>

            <CategoryChart data={dashboard.categoryBreakdown} />
          </div>

          {/* Category Breakdown */}
          <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Spending by Category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your total spending grouped by category.
              </p>
            </div>

            {dashboard.categoryBreakdown.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500">No expense data yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {dashboard.categoryBreakdown.map((category) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {category.categoryName}
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      ₱
                      {category.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
