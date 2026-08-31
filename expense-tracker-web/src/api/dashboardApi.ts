import type { BudgetAlert } from "../types/budgetAlert";
import type { DashboardResponse } from "../types/dashboard";
import apiClient from "./apiClient";

export async function getDashboard(): Promise<DashboardResponse> {
    const reponse =
        await apiClient.get<DashboardResponse>("/dashboard");

    return reponse.data;
}

export async function getBudgetAlerts(): Promise<BudgetAlert[]> {
    const response =
        await apiClient.get<BudgetAlert[]>("/dashboard/budget-alerts");

    return response.data;
}