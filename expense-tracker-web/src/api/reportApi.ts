import type { MonthlySpending } from "../types/report";
import apiClient from "./apiClient";

export async function getMonthlySpending(
    months: number = 6,
): Promise<MonthlySpending[]> {
    const response = await apiClient.get<MonthlySpending[]>(
        "/reports/monthly-spending",
        {
            params: { months },
        },
    );

    return response.data;
}