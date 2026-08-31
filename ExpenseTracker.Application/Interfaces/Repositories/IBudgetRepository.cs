using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces.Repositories;

public interface IBudgetRepository
{
    Task<Budget> AddAsync(Budget budget);

    Task<IEnumerable<Budget>> GetAllByUserAsync(
        int userId,
        int month,
        int year);

    Task<Budget?> GetByIdAsync(int userId, int budgetId);

    Task<Budget?> GetByUserCategoryMonthYearAsync(
        int userId,
        int categoryId,
        int month,
        int year);

    Task UpdateAsync(Budget budget);

    Task DeleteAsync(Budget budget);
}
