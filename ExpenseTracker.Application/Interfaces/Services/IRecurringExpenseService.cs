using ExpenseTracker.Application.DTOs.RecurringExpenses;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IRecurringExpenseService
{
    Task<RecurringExpenseResponse> CreateAsync(
        int userId,
        CreateRecurringExpenseRequest request);

    Task<IEnumerable<RecurringExpenseResponse>> GetAllAsync(int userId);

    Task<RecurringExpenseResponse?> GetByIdAsync(
        int userId,
        int recurringExpenseId);

    Task<RecurringExpenseResponse?> UpdateAsync(
        int userId,
        int recurringExpenseId,
        UpdateRecurringExpenseRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int recurringExpenseId);

    Task<int> ProcessDueAsync();
}
