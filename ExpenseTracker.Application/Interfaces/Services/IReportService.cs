using ExpenseTracker.Application.DTOs.Reports;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IReportService
{
    Task<IEnumerable<MonthlySpendingResponse>> GetMonthlySpendingAsync(
        int userId,
        int months);

    Task<IEnumerable<CategorySpendingResponse>> GetCategorySpendingAsync(
    int userId,
    int month,
    int year);
}
