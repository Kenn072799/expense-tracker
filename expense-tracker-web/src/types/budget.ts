export interface Budget {
    budgetId: number;
    categoryId: number;
    categoryName: string;
    amount: number;
    month: number;
    year: number;
    spentAmount: number;
    remainingAmount: number;
    progressPercentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBudgetRequest {
  categoryId: number;
  amount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetRequest {
  amount: number;
}