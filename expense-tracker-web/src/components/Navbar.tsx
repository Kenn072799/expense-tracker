import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold text-gray-900">Expense Tracker</h1>

          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/expenses" className={linkClass}>
              Expenses
            </NavLink>
            <NavLink to="/budgets" className={linkClass}>
              Budgets
            </NavLink>
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
