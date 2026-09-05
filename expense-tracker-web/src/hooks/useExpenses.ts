import { useEffect, useState } from "react";

import type { ExpenseResponse } from "../types/expense";

import { getExpenses } from "../api/expenseApi";

import useDebounce from "./useDebounce";

const PAGE_SIZE = 10;

export default function useExpenses() {
  const [expenses, setExpenses] =
    useState<ExpenseResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(0);

  const [search, setSearch] = useState("");

  const debouncedSearch =
    useDebounce(search.trim(), 500);

  const [categoryId, setCategoryId] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [sortBy, setSortBy] =
    useState("expenseDate");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const hasActiveFilters =
    search !== "" ||
    categoryId !== "" ||
    startDate !== "" ||
    endDate !== "" ||
    sortBy !== "expenseDate" ||
    sortDirection !== "desc";

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      try {
        setLoading(true);
        setError("");

        const result = await getExpenses({
          page,
          pageSize: PAGE_SIZE,

          categoryId:
            categoryId === ""
              ? undefined
              : Number(categoryId),

          startDate:
            startDate || undefined,

          endDate:
            endDate || undefined,

          search:
            debouncedSearch || undefined,

          sortBy,
          sortDirection,
        });

        if (cancelled) {
          return;
        }

        setExpenses(result.items);
        setTotalPages(result.totalPages);
      } catch {
        if (!cancelled) {
          setError("Failed to load expenses.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    categoryId,
    startDate,
    endDate,
    debouncedSearch,
    sortBy,
    sortDirection,
    refreshKey,
  ]);

  function refresh() {
    setRefreshKey(
      (current) => current + 1,
    );
  }

  function resetPage() {
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setStartDate("");
    setEndDate("");
    setSortBy("expenseDate");
    setSortDirection("desc");
    setPage(1);
  }

  function changeCategory(value: string) {
    setCategoryId(value);
    resetPage();
  }

  function changeStartDate(value: string) {
    setStartDate(value);
    resetPage();
  }

  function changeEndDate(value: string) {
    setEndDate(value);
    resetPage();
  }

  function changeSortBy(value: string) {
    setSortBy(value);
    resetPage();
  }

  function changeSortDirection(
    value: "asc" | "desc",
  ) {
    setSortDirection(value);
    resetPage();
  }

  return {
    expenses,
    loading,
    error,
    setError,

    page,
    setPage,
    totalPages,

    search,
    setSearch,

    categoryId,
    startDate,
    endDate,

    sortBy,
    sortDirection,

    hasActiveFilters,

    refresh,
    clearFilters,

    changeCategory,
    changeStartDate,
    changeEndDate,
    changeSortBy,
    changeSortDirection,
  };
}