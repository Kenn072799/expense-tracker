using ExpenseTracker.Application.DTOs.Common;
using ExpenseTracker.Application.DTOs.Expenses;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IExpenseService
{
    Task<ExpenseResponse> CreateAsync(
        int userId,
        CreateExpenseRequest request);

    Task<PagedResponse<ExpenseResponse>> GetAllAsync(
        int userId,
        ExpenseFilterRequest filter);

    Task<ExpenseResponse?> GetByIdAsync(
        int userId,
        int expenseId);

    Task<ExpenseResponse?> UpdateAsync(
        int userId,
        int expenseId,
        UpdateExpenseRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int expenseId);
}