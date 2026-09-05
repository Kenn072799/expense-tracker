namespace ExpenseTracker.Application.DTOs.RecurringExpenses;

public class UpdateRecurringExpenseRequest
{
    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public string Frequency { get; set; } = string.Empty;

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; }
}