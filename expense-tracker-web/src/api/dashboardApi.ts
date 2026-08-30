import type { DashboardResponse } from "../types/dashboard";
import apiClient from "./apiClient";

export async function getDashboard(): Promise<DashboardResponse> {
    const reponse =
        await apiClient.get<DashboardResponse>("/dashboard");

    return reponse.data;
}