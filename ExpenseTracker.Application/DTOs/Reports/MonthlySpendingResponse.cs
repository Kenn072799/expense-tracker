namespace ExpenseTracker.Application.DTOs.Reports;

public class MonthlySpendingResponse
{
    public int Month { get; set; }

    public int Year { get; set; }

    public decimal TotalSpent { get; set; }

    public int TransactionCount { get; set; }
}
