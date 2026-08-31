using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.DTOs.Reports;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly ExpenseTrackerDbContext _context;

    public ExpenseRepository(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<Expense> AddAsync(Expense expense)
    {
        var addedExpense = await _context.Expenses.AddAsync(expense);

        await _context.SaveChangesAsync();

        return addedExpense.Entity;
    }


    // GET ALL expenses belonging to one user
    public async Task<IEnumerable<Expense>> GetAllByUserIdAsync(
        int userId,
        ExpenseFilterRequest filter)
    {
        var query = _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId)
            .AsQueryable();

        if (filter.CategoryId.HasValue)
        {
            query = query.Where(e =>
                e.CategoryId == filter.CategoryId.Value);
        }

        if (filter.StartDate.HasValue)
        {
            query = query.Where(e =>
                e.ExpenseDate >= filter.StartDate.Value);
        }

        if (filter.EndDate.HasValue)
        {
            query = query.Where(e =>
                e.ExpenseDate <= filter.EndDate.Value);
        }

        var descending =
            filter.SortDirection.Equals(
                "desc",
                StringComparison.OrdinalIgnoreCase);

        query = filter.SortBy.ToLower() switch
        {
            "amount" => descending
                ? query.OrderByDescending(e => e.Amount)
                : query.OrderBy(e => e.Amount),

            "createdat" => descending
                ? query.OrderByDescending(e => e.CreatedAt)
                : query.OrderBy(e => e.CreatedAt),

            _ => descending
                ? query.OrderByDescending(e => e.ExpenseDate)
                : query.OrderBy(e => e.ExpenseDate)
        };

        return await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();
    }


    // GET ONE expense belonging to one user
    public async Task<Expense?> GetByIdAsync(
        int userId,
        int expenseId)
    {
        var expense = await _context.Expenses
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e =>
                e.ExpenseId == expenseId &&
                e.UserId == userId);

        return expense;
    }


    // UPDATE
    public async Task UpdateAsync(Expense expense)
    {
        _context.Expenses.Update(expense);

        await _context.SaveChangesAsync();
    }


    // DELETE
    public async Task DeleteAsync(Expense expense)
    {
        _context.Expenses.Remove(expense);

        await _context.SaveChangesAsync();
    }

    public async Task<int> CountByUserIdAsync(
        int userId,
        ExpenseFilterRequest filter)
    {
        var query = _context.Expenses
            .Where(e => e.UserId == userId)
            .AsQueryable();

        if (filter.CategoryId.HasValue)
        {
            query = query.Where(e =>
                e.CategoryId == filter.CategoryId.Value);
        }

        if (filter.StartDate.HasValue)
        {
            query = query.Where(e =>
                e.ExpenseDate >= filter.StartDate.Value);
        }

        if (filter.EndDate.HasValue)
        {
            var endDateExclusive =
                filter.EndDate.Value.Date.AddDays(1);

            query = query.Where(e =>
                e.ExpenseDate < endDateExclusive);
        }

        return await query.CountAsync();
    }

    public async Task<IEnumerable<Expense>> GetAllForDashboardAsync(int userId)
    {
        return await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Expense>> GetByMonthAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Expenses
            .Where(e => 
                e.UserId == userId &&
                e.ExpenseDate.Year == year &&
                e.ExpenseDate.Month == month)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<MonthlySpendingResponse>> GetMonthlySpendingAsync(
        int userId,
        int months)
    {
        var startDate = DateTime.UtcNow
            .AddMonths(-(months - 1));

        startDate = new DateTime(
            startDate.Year,
            startDate.Month,
            1);

        return await _context.Expenses
            .Where(e =>
                e.UserId == userId &&
                e.ExpenseDate >= startDate)
            .GroupBy(e => new
            {
                e.ExpenseDate.Year,
                e.ExpenseDate.Month
            })
            .Select(group => new MonthlySpendingResponse
            {
                Year = group.Key.Year,
                Month = group.Key.Month,
                TotalSpent = group.Sum(e => e.Amount),
                TransactionCount = group.Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .AsNoTracking()
            .ToListAsync();
    }
}