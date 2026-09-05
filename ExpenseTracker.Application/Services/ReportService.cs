using ExpenseTracker.Application.DTOs.Reports;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;

namespace ExpenseTracker.Application.Services;

public class ReportService : IReportService
{
    private readonly IExpenseRepository _expenseRepository;

    public ReportService(IExpenseRepository expenseRepository)
    {
        _expenseRepository = expenseRepository;
    }

    public async Task<IEnumerable<MonthlySpendingResponse>> GetMonthlySpendingAsync(
        int userId,
        int months)
    {
        if (months <= 0)
        {
            throw new InvalidOperationException(
                "Months must be greater than zero.");
        }

        if (months > 24)
        {
            throw new InvalidOperationException(
                "Reports are limited to 24 months.");
        }

        return await _expenseRepository.GetMonthlySpendingAsync(
            userId,
            months);
    }

    public async Task<IEnumerable<CategorySpendingResponse>> GetCategorySpendingAsync(
    int userId,
    int month,
    int year)
    {
        if (month < 1 || month > 12)
        {
            throw new ArgumentException("Month must be between 1 and 12.");
        }

        if (year <= 0)
        {
            throw new ArgumentException("Year must be valid.");
        }

        return await _expenseRepository.GetCategorySpendingAsync(
            userId,
            month,
            year);
    }
}