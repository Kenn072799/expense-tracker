import apiClient from "./apiClient";
import type {
  CreateRecurringExpenseRequest,
  RecurringExpense,
  UpdateRecurringExpenseRequest,
} from "../types/recurringExpense";

export async function getRecurringExpenses(): Promise<
  RecurringExpense[]
> {
  const response =
    await apiClient.get<RecurringExpense[]>(
      "/RecurringExpenses",
    );

  return response.data;
}

export async function createRecurringExpense(
  request: CreateRecurringExpenseRequest,
): Promise<RecurringExpense> {
  const response =
    await apiClient.post<RecurringExpense>(
      "/RecurringExpenses",
      request,
    );

  return response.data;
}

export async function updateRecurringExpense(
  recurringExpenseId: number,
  request: UpdateRecurringExpenseRequest,
): Promise<RecurringExpense> {
  const response =
    await apiClient.put<RecurringExpense>(
      `/RecurringExpenses/${recurringExpenseId}`,
      request,
    );

  return response.data;
}

export async function deleteRecurringExpense(
  recurringExpenseId: number,
): Promise<void> {
  await apiClient.delete(
    `/RecurringExpenses/${recurringExpenseId}`,
  );
}