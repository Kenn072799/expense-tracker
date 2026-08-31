namespace ExpenseTracker.Application.DTOs.Budgets;

public class BudgetResponse
{
    public int BudgetId { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal SpentAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public decimal ProgressPercentage { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
