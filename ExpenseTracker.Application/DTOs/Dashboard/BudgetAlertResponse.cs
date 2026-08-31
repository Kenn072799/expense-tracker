namespace ExpenseTracker.Application.DTOs.Dashboard;

public class BudgetAlertResponse
{
    public int BudgetId { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public decimal BudgetAmount { get; set; }

    public decimal SpentAmount { get; set; }

    public decimal RemainingAmount {  get; set; }

    public decimal ProgressPercentage { get; set; }

    public string Status { get; set; } = string.Empty;
}
