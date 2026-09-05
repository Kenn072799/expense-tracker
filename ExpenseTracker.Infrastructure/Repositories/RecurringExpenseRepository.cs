using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class RecurringExpenseRepository : IRecurringExpenseRepository
{
    private readonly ExpenseTrackerDbContext _context;

    public RecurringExpenseRepository(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<RecurringExpense> AddAsync(
        RecurringExpense recurringExpense)
    {
        var entry = await _context.RecurringExpenses
            .AddAsync(recurringExpense);

        await _context.SaveChangesAsync();

        return entry.Entity;
    }

    public async Task<IEnumerable<RecurringExpense>> GetAllByUserAsync(
        int userId)
    {
        return await _context.RecurringExpenses
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.NextRunDate)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<RecurringExpense?> GetByIdAsync(
    int userId,
    int recurringExpenseId)
    {
        return await _context.RecurringExpenses
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.RecurringExpenseId == recurringExpenseId);
    }

    public async Task UpdateAsync(
        RecurringExpense recurringExpense)
    {
        _context.RecurringExpenses.Update(recurringExpense);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(
        RecurringExpense recurringExpense)
    {
        _context.RecurringExpenses.Remove(recurringExpense);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<RecurringExpense>> GetDueAsync(
        DateTime currentDate)
    {
        return await _context.RecurringExpenses
            .Where(x =>
                x.IsActive &&
                x.NextRunDate <= currentDate &&
                (x.EndDate == null || x.NextRunDate <= x.EndDate))
            .ToListAsync();
    }

}
