namespace ExpenseTracker.Application.DTOs.Budgets;

public class CreateBudgetRequest
{
    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

}
