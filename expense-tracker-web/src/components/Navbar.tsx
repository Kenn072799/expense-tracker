import {
  LayoutDashboard,
  LogOut,
  Plus,
  ReceiptText,
  Repeat2,
  WalletCards,
  WalletMinimal,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/budgets", label: "Budgets", icon: WalletCards },
  { to: "/recurring-expenses", label: "Recurring", icon: Repeat2 },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-5 lg:flex">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 rounded-2xl px-2 py-1.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm shadow-slate-300">
            <WalletMinimal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-slate-950">
              Expense Tracker
            </p>
            <p className="text-xs text-slate-500">Personal finance</p>
          </div>
        </NavLink>

        <div className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </div>

        <nav aria-label="Primary navigation" className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 ${
                        isActive
                          ? "text-emerald-300"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    {item.label}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <NavLink
          to="/expenses?create=1"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add expense
        </NavLink>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
            <WalletMinimal className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950">
              Expense Tracker
            </p>
            <p className="text-[10px] text-slate-500">Personal finance</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${
                  isActive ? "text-emerald-700" : "text-slate-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-10 items-center justify-center rounded-full transition ${
                      isActive ? "bg-emerald-100" : "bg-transparent"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
