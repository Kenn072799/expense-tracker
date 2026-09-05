import type { PagedResponse } from "../types/common";
import type {
  CreateExpenseRequest,
  ExpenseFilterRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from "../types/expense";
import apiClient from "./apiClient";

export async function getExpenses(
  filter: ExpenseFilterRequest,
): Promise<PagedResponse<ExpenseResponse>> {
  const response = await apiClient.get<PagedResponse<ExpenseResponse>>(
    "expenses",
    {
      params: filter,
    },
  );

  return response.data;
}

export async function getExpenseById(
  expenseId: number,
): Promise<ExpenseResponse> {
  const response = await apiClient.get<ExpenseResponse>(
    `/expenses/${expenseId}`,
  );

  return response.data;
}

export async function createExpense(
  request: CreateExpenseRequest,
): Promise<ExpenseResponse> {
  const response = await apiClient.post<ExpenseResponse>("/expenses", request);

  return response.data;
}

export async function updateExpense(
  expenseId: number,
  request: UpdateExpenseRequest,
): Promise<ExpenseResponse> {
  const response = await apiClient.put<ExpenseResponse>(
    `/expenses/${expenseId}`,
    request,
  );

  return response.data;
}

export async function deleteExpense(expenseId: number): Promise<void> {
  await apiClient.delete(`/expenses/${expenseId}`);
}

export async function getRecentExpenses(
  limit = 5,
): Promise<ExpenseResponse[]> {
  const response = await apiClient.get<
    ExpenseResponse[]
  >("/expenses/recent", {
    params: {
      limit,
    },
  });

  return response.data;
}
