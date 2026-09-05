export interface RecurringExpense {
  recurringExpenseId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  description: string | null;
  frequency: string;
  startDate: string;
  nextRunDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringExpenseRequest {
  categoryId: number;
  amount: number | "";
  description?: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
}

export interface UpdateRecurringExpenseRequest {
  categoryId: number;
  amount: number;
  description?: string;
  frequency: string;
  endDate?: string | null;
  isActive: boolean;
}