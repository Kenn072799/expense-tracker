
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllActiveAsync();

    Task<Category?> GetByIdAsync(int categoryId);
}
