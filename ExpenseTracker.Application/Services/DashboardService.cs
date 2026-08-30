using ExpenseTracker.Application.DTOs.Dashboard;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;

namespace ExpenseTracker.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IExpenseRepository _expenseRepository;

    public DashboardService(IExpenseRepository expenseRepository)
    {
        _expenseRepository = expenseRepository;
    }

    public async Task<DashboardResponse> GetDashboardAsync(int userId)
    {
        var expenses =
            (await _expenseRepository
            .GetAllForDashboardAsync(userId))
            .ToList();

        var now = DateTime.UtcNow;

        var totalExpenses = expenses.Sum(e => e.Amount);

        var thisMonthExpenses = expenses
            .Where(e =>
                e.ExpenseDate.Year == now.Year &&
                e.ExpenseDate.Month == now.Month)
            .Sum(e => e.Amount);

        var categoryBreakdown = expenses
            .GroupBy(e => new
            {
                e.ExpenseId,
                CategoryName = 
                    e.Category?.Name ?? "Unknown"
            })
            .Select(group =>
                new CategoryExpenseResponse
                {
                    CategoryId = group.Key.ExpenseId,
                    CategoryName =
                        group.Key.CategoryName,
                    TotalAmount =
                        group.Sum(e => e.Amount)
                })
            .OrderByDescending(x => x.TotalAmount)
            .ToList();

        return new DashboardResponse
        {
            TotalExpenses = totalExpenses,
            ThisMonthExpenses = thisMonthExpenses,
            TotalTransactions = expenses.Count,
            CategoryBreakdown = categoryBreakdown
        };
    }
}
