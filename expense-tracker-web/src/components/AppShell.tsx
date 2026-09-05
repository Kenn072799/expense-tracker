import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageNames: Record<string, string> = {
      "/dashboard": "Overview",
      "/expenses": "Expenses",
      "/budgets": "Budgets",
      "/recurring-expenses": "Recurring expenses",
    };

    document.title = `${pageNames[pathname] ?? "Workspace"} · Expense Tracker`;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0"
      >
        Skip to content
      </a>

      <Navbar />

      <div
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 pb-20 outline-none lg:pb-0"
      >
        <Outlet />
      </div>
    </div>
  );
}
