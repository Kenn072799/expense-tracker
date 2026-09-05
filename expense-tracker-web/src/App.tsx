import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./components/AppShell";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const BudgetsPage = lazy(() => import("./pages/BudgetsPage"));
const RecurringExpensesPage = lazy(
  () => import("./pages/RecurringExpensesPage"),
);

function RouteLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3 text-sm font-medium text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-100 border-t-emerald-600" />
        Loading your workspace…
      </div>
    </div>
  );
}

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Loadable><LoginPage /></Loadable>} />

      <Route path="/register" element={<Loadable><RegisterPage /></Loadable>} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Loadable><DashboardPage /></Loadable>} />
        <Route path="/expenses" element={<Loadable><ExpensesPage /></Loadable>} />
        <Route path="/budgets" element={<Loadable><BudgetsPage /></Loadable>} />
        <Route
          path="/recurring-expenses"
          element={<Loadable><RecurringExpensesPage /></Loadable>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
