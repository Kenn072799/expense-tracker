export interface CategoryExpenseResponse {
    categoryId: number;
    categoryName: string;
    totalAmount: number;
}

export interface DashboardResponse {
    totalExpenses: number;
    thisMonthExpenses: number;
    totalTransactions: number;
    categoryBreakdown: CategoryExpenseResponse[];
    firstName: string;
}