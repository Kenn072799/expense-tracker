namespace ExpenseTracker.Application.DTOs.Dashboard;

public class DashboardResponse
{
    public decimal TotalExpenses { get; set; }

    public decimal ThisMonthExpenses { get; set; }

    public int TotalTransactions { get; set; }

    public List<CategoryExpenseResponse> CategoryBreakdown { get; set; } = new();
}
