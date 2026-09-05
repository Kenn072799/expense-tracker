import { useState } from "react";

import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { register } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

import type { RegisterRequest } from "../types/auth";

export default function RegisterPage() {
  const [form, setForm] =
    useState<RegisterRequest>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const navigate =
    useNavigate();

  const {
    login: authenticate,
  } = useAuth();

  const isValid =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password !== "";

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!isValid || loading) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result =
        await register(form);

      authenticate(
        result.token,
      );

      navigate(
        "/dashboard",
      );
    } catch {
      setMessage(
        "Registration failed. Please check your information and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Side */}
        <motion.section
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-12 py-10 text-white lg:flex xl:px-16"
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <WalletCards className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="font-semibold">
                Expense Tracker
              </p>

              <p className="text-xs text-gray-400">
                Personal Finance
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
              <WalletCards className="h-7 w-7 text-violet-300" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Build better money
              habits.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-gray-400">
              Create your account
              and start tracking
              expenses, planning
              budgets, and reviewing
              your spending patterns
              in one place.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">
                  Track
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your expenses
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">
                  Budget
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your month
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">
                  Improve
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your habits
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Track your spending.
            Understand your money.
          </p>
        </motion.section>

        {/* Register Side */}
        <section className="flex w-full items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2 lg:px-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="w-full max-w-md"
          >
            {/* Mobile Brand */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 shadow-sm">
                <WalletCards className="h-5 w-5 text-white" />
              </div>

              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  Expense Tracker
                </p>

                <p className="text-xs text-gray-500">
                  Personal Finance
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold text-violet-600">
                Get started
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your
                information below to
                start tracking your
                finances.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
              {/* Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={
                        form.firstName
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="given-name"
                      placeholder="First name"
                      disabled={
                        loading
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={
                        form.lastName
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="family-name"
                      placeholder="Last name"
                      disabled={
                        loading
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={
                      loading
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="new-password"
                    placeholder="Create a password"
                    disabled={
                      loading
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                  <motion.button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev,
                      )
                    }
                    disabled={
                      loading
                    }
                    whileTap={{
                      scale: 0.92,
                    }}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-gray-400">
                  Use a password you
                  don't reuse on other
                  accounts.
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
                  >
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                    <div>
                      <p className="text-sm font-medium text-red-700">
                        Unable to create
                        account
                      </p>

                      <p className="mt-0.5 text-sm text-red-600">
                        {message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={
                  loading ||
                  !isValid
                }
                whileHover={
                  loading ||
                  !isValid
                    ? undefined
                    : {
                        y: -1,
                      }
                }
                whileTap={
                  loading ||
                  !isValid
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Login */}
            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an
                account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Mobile Footer */}
            <p className="mt-8 text-center text-xs text-gray-400 lg:hidden">
              Track your spending.
              Understand your money.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
