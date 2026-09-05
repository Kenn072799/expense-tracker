using ExpenseTracker.Application.DTOs.Dashboard;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;

namespace ExpenseTracker.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly IBudgetRepository _budgetRepository;
    private readonly IUserRepository _userRepository;

    public DashboardService(
        IExpenseRepository expenseRepository,
        IBudgetRepository budgetRepository,
        IUserRepository userRepository)
    {
        _expenseRepository = expenseRepository;
        _budgetRepository = budgetRepository;
        _userRepository = userRepository;
    }

    public async Task<DashboardResponse> GetDashboardAsync(int userId)
    {
        var user =
            await _userRepository.GetByIdAsync(userId);

        var expenses =
            (await _expenseRepository
                .GetAllForDashboardAsync(userId))
            .ToList();

        var now = DateTime.UtcNow;

        var totalExpenses =
            expenses.Sum(e => e.Amount);

        var thisMonthExpenses =
            expenses
                .Where(e =>
                    e.ExpenseDate.Year == now.Year &&
                    e.ExpenseDate.Month == now.Month)
                .Sum(e => e.Amount);

        var categoryBreakdown =
            expenses
                .GroupBy(e => new
                {
                    e.CategoryId,
                    CategoryName =
                        e.Category?.Name ?? "Unknown"
                })
                .Select(group =>
                    new CategoryExpenseResponse
                    {
                        CategoryId =
                            group.Key.CategoryId,

                        CategoryName =
                            group.Key.CategoryName,

                        TotalAmount =
                            group.Sum(e => e.Amount)
                    })
                .OrderByDescending(x =>
                    x.TotalAmount)
                .ToList();

        return new DashboardResponse
        {
            FirstName =
                user?.FirstName ?? "User",

            TotalExpenses =
                totalExpenses,

            ThisMonthExpenses =
                thisMonthExpenses,

            TotalTransactions =
                expenses.Count,

            CategoryBreakdown =
                categoryBreakdown
        };
    }

    public async Task<IEnumerable<BudgetAlertResponse>> GetBudgetAlertsAsync(
        int userId)
    {
        var today =
            DateTime.UtcNow;

        var month =
            today.Month;

        var year =
            today.Year;

        var budgets =
            await _budgetRepository.GetAllByUserAsync(
                userId,
                month,
                year);

        var expenses =
            await _expenseRepository.GetByMonthAsync(
                userId,
                month,
                year);

        var alerts =
            budgets.Select(budget =>
            {
                var spentAmount =
                    expenses
                        .Where(e =>
                            e.CategoryId ==
                            budget.CategoryId)
                        .Sum(e =>
                            e.Amount);

                var remainingAmount =
                    budget.Amount -
                    spentAmount;

                var progressPercentage =
                    budget.Amount > 0
                        ? Math.Round(
                            (spentAmount /
                             budget.Amount) *
                            100,
                            2)
                        : 0;

                string status;

                if (progressPercentage >= 100)
                {
                    status =
                        "Over Budget";
                }
                else if (progressPercentage >= 80)
                {
                    status =
                        "Near Limit";
                }
                else
                {
                    status =
                        "Normal";
                }

                return new BudgetAlertResponse
                {
                    BudgetId =
                        budget.BudgetId,

                    CategoryId =
                        budget.CategoryId,

                    CategoryName =
                        budget.Category?.Name ??
                        "Unknown",

                    BudgetAmount =
                        budget.Amount,

                    SpentAmount =
                        spentAmount,

                    RemainingAmount =
                        remainingAmount,

                    ProgressPercentage =
                        progressPercentage,

                    Status =
                        status
                };
            });

        return alerts;
    }
}