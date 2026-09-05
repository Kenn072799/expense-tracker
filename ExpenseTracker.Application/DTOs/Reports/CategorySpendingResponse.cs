namespace ExpenseTracker.Application.DTOs.Reports;

public class CategorySpendingResponse
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public decimal TotalSpent { get; set; }

    public int TransactionCount { get; set; }
}
