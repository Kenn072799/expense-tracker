using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
   private readonly ExpenseTrackerDbContext _dbContext;

    public CategoryRepository(ExpenseTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Category>> GetAllActiveAsync()
    {
        var categories = await _dbContext.Categories
            .Where(c => c.IsActive)
            .ToListAsync();

        return categories;
    }

    public async Task<Category?> GetByIdAsync(int categoryId)
    {
        return await _dbContext.Categories
            .FirstOrDefaultAsync(c => 
                c.CategoryId == categoryId &&
                c.IsActive);
    }
}
