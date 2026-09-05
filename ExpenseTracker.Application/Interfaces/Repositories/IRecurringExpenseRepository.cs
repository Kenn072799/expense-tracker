using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces.Repositories;

public interface IRecurringExpenseRepository
{
    Task<RecurringExpense> AddAsync(
        RecurringExpense recurringExpense);

    Task<IEnumerable<RecurringExpense>> GetAllByUserAsync(int userId);

    Task<RecurringExpense?> GetByIdAsync(
        int userId,
        int recurringExpenseId);

    Task UpdateAsync(RecurringExpense recurringExpense);

    Task DeleteAsync(RecurringExpense recurringExpense);

    Task<IEnumerable<RecurringExpense>> GetDueAsync(DateTime currentDate);
}
