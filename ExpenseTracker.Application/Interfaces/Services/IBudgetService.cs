using ExpenseTracker.Application.DTOs.Budgets;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IBudgetService
{
    Task<BudgetResponse> CreateAsync(
        int userId,
        CreateBudgetRequest request);

    Task<IEnumerable<BudgetResponse>> GetAllAsync(
        int userId,
        int month,
        int year);

    Task<BudgetResponse?> GetByIdAsync(
        int userId,
        int budgetId);

    Task<BudgetResponse?> UpdateAsync(
        int userId,
        int budgetId,
        UpdateBudgetRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int budgetId);
}