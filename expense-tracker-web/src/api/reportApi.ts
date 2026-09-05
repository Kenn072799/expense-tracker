import type { CategorySpendingResponse, MonthlySpendingResponse } from "../types/report";
import apiClient from "./apiClient";

export async function getMonthlySpending(
    months: number = 6,
): Promise<MonthlySpendingResponse[]> {
    const response = await apiClient.get<MonthlySpendingResponse[]>(
        "/reports/monthly-spending",
        {
            params: { months },
        },
    );

    return response.data;
}

export async function getCategorySpending(
  month: number,
  year: number,
): Promise<CategorySpendingResponse[]> {
  const response = await apiClient.get<CategorySpendingResponse[]>(
    "/reports/category-spending",
    {
      params: {
        month,
        year,
      },
    },
  );

  return response.data;
}