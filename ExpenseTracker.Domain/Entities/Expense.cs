namespace ExpenseTracker.Domain.Entities;

public class Expense
{
    public int ExpenseId { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public DateTime ExpenseDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public User? User { get; set; }

    public Category? Category { get; set; }

    public int? RecurringExpenseId { get; set; }

    public DateTime? RecurringOccurrenceDate { get; set; }

    public RecurringExpense? RecurringExpense { get; set; }
}