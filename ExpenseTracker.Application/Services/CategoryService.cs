using ExpenseTracker.Application.DTOs.Categories;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;

namespace ExpenseTracker.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllActiveAsync();

        categories = categories.OrderBy(c => c.Name);

        return categories.Select(c => new CategoryResponse
        {
            CategoryId = c.CategoryId,
            Name = c.Name,
            IsActive = c.IsActive
        });
    }
}