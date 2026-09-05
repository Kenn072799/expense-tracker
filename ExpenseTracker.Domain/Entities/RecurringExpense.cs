namespace ExpenseTracker.Domain.Entities;

public class RecurringExpense
{
    public int RecurringExpenseId { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public string Frequency { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime NextRunDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;

    public Category Category { get; set; } = null!;
}
