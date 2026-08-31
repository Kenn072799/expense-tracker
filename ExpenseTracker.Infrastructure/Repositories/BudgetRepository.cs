using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class BudgetRepository : IBudgetRepository
{
    private readonly ExpenseTrackerDbContext _context;

    public BudgetRepository(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<Budget> AddAsync(Budget budget)
    {
        var result = await _context.Budgets.AddAsync(budget);

        await _context.SaveChangesAsync();

        return result.Entity;
    }

    public async Task<IEnumerable<Budget>> GetAllByUserAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Budgets
            .Include(b => b.Category)
            .Where(b =>
                b.UserId == userId &&
                b.Month == month &&
                b.Year == year)
            .OrderBy(b => b.Category.Name)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Budget?> GetByIdAsync(
        int userId,
        int budgetId)
    {
        return await _context.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b =>
                b.UserId == userId &&
                b.BudgetId == budgetId);
    }

    public async Task<Budget?> GetByUserCategoryMonthYearAsync(
        int userId,
        int categoryId,
        int month,
        int year)
    {
        return await _context.Budgets
            .FirstOrDefaultAsync(b =>
                b.UserId == userId &&
                b.CategoryId == categoryId &&
                b.Month == month &&
                b.Year == year);
    }

    public async Task UpdateAsync(Budget budget)
    {
        _context.Budgets.Update(budget);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Budget budget)
    {
        _context.Budgets.Remove(budget);

        await _context.SaveChangesAsync();
    }
}