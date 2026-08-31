export interface BudgetAlert {
  budgetId: number;
  categoryId: number;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  status: string;
}