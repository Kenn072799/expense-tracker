import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboard } from "../api/dashboardApi";
import type { DashboardResponse } from "../types/dashboard";
import CategoryChart from "../components/CategoryChart";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = await getDashboard();

        setDashboard(result);
      } catch {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

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
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your expenses.
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
