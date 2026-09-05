namespace ExpenseTracker.Application.DTOs.RecurringExpenses;

public class CreateRecurringExpenseRequest
{
    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public string Frequency { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
