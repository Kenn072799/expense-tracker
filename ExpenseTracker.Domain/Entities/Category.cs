namespace ExpenseTracker.Domain.Entities;

public class Category
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public ICollection<Expense> Expenses { get; set; }
    = new List<Expense>();

    public ICollection<Budget> Budgets { get; set; }
    = new List<Budget>();
}