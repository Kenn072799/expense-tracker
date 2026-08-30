using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces.Repositories;

public interface IExpenseRepository
{
    Task<Expense> AddAsync(Expense expense);

    Task<IEnumerable<Expense>> GetAllByUserIdAsync(
        int userId,
        ExpenseFilterRequest filter);

    Task<Expense?> GetByIdAsync(int userId, int expenseId);

    Task UpdateAsync(Expense expense);

    Task DeleteAsync(Expense expense);

    Task<int> CountByUserIdAsync(
        int userId,
        ExpenseFilterRequest filter);

    Task<IEnumerable<Expense>> GetAllForDashboardAsync(int userId);
}
