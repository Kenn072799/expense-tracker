export interface ExpenseResponse {
    expenseId: number;
    categoryId: number;
    categoryName: string;
    amount: number;
    description: string | null;
    expenseDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseRequest {
    categoryId: number;
    amount: number;
    description?: string;
    expenseDate: string;
}

export interface UpdateExpenseRequest {
    categoryId: number;
    amount: number;
    description?: string;
    expenseDate: string;
}

export interface ExpenseFilterRequest {
    page: number;
    pageSize: number;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDirection: "asc" | "desc";
}