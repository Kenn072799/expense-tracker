export interface MonthlySpendingResponse {
    month: number;
    year: number;
    totalSpent: number;
    transactionCount: number;
}

export interface CategorySpendingResponse {
  categoryId: number;
  categoryName: string;
  totalSpent: number;
  transactionCount: number;
}