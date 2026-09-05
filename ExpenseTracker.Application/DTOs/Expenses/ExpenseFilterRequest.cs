namespace ExpenseTracker.Application.DTOs.Expenses;

public class ExpenseFilterRequest
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public int? CategoryId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Search { get; set; }

    public string SortBy { get; set; } = "expenseDate";

    public string SortDirection { get; set; } = "desc";
}
