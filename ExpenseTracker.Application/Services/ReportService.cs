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
}