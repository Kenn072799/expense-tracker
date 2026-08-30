using ExpenseTracker.Application.DTOs.Categories;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync();
}
