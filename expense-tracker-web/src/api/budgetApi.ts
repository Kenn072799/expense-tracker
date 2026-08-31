import type {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../types/budget";
import apiClient from "./apiClient";

export const getBudgets = async (
  month: number,
  year: number,
): Promise<Budget[]> => {
  const response = await apiClient.get<Budget[]>("/budgets", {
    params: { month, year },
  });

  return response.data;
};

export const createBudget = async (
  request: CreateBudgetRequest,
): Promise<Budget> => {
  const response = await apiClient.post<Budget>("/budgets", request);

  return response.data;
};

export const updateBudget = async (
  budgetId: number,
  request: UpdateBudgetRequest,
): Promise<Budget> => {
  const response = await apiClient.put<Budget>(`/budgets/${budgetId}`, request);

  return response.data;
};

export const deleteBudget = async (budgetId: number): Promise<void> => {
  await apiClient.delete(`/budgets/${budgetId}`);
};
