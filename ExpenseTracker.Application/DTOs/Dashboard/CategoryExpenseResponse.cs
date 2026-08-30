namespace ExpenseTracker.Application.DTOs.Dashboard;

public class CategoryExpenseResponse
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
}
