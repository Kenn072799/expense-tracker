using ExpenseTracker.Application.DTOs.Common;
using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ExpenseService(
        IExpenseRepository expenseRepository,
        ICategoryRepository categoryRepository)
    {
        _expenseRepository = expenseRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ExpenseResponse> CreateAsync(
        int userId,
        CreateExpenseRequest request)
    {
        var category =
            await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category == null)
        {
            throw new ArgumentException(
                "Category does not exist or is inactive.");
        }

        var expense = new Expense
        {
            UserId = userId,
            CategoryId = request.CategoryId,
            Category = category,
            Amount = request.Amount,
            Description = request.Description,
            ExpenseDate = request.ExpenseDate
        };

        var savedExpense =
            await _expenseRepository.AddAsync(expense);

        return MapToResponse(savedExpense);
    }

    public async Task<PagedResponse<ExpenseResponse>> GetAllAsync(
        int userId,
        ExpenseFilterRequest filter)
    {
        if (filter.Page < 1)
        {
            filter.Page = 1;
        }

        if (filter.PageSize < 1)
        {
            filter.PageSize = 10;
        }

        if (filter.PageSize > 100)
        {
            filter.PageSize = 100;
        }

        var expenses =
            await _expenseRepository.GetAllByUserIdAsync(
                userId,
                filter);

        var totalCount =
            await _expenseRepository.CountByUserIdAsync(
                userId,
                filter);

        var items = expenses.Select(MapToResponse);

        return new PagedResponse<ExpenseResponse>
        {
            Items = items,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(
                (double)totalCount / filter.PageSize)
        };
    }

    public async Task<ExpenseResponse?> GetByIdAsync(
        int userId,
        int expenseId)
    {
        var expense = await _expenseRepository.GetByIdAsync(userId, expenseId);
        if (expense == null)
        {
            return null;
        }

        return MapToResponse(expense);
    }

    public async Task<ExpenseResponse?> UpdateAsync(
        int userId,
        int expenseId,
        UpdateExpenseRequest request)
    {

        var expense = await _expenseRepository.GetByIdAsync(userId, expenseId);

        if (expense == null)
        {
            return null;
        }

        var category =
            await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category == null)
        {
            throw new ArgumentException(
                "Category does not exist or is inactive.");
        }

        expense.CategoryId = request.CategoryId;
        expense.Category = category;
        expense.Amount = request.Amount;
        expense.Description = request.Description;
        expense.ExpenseDate = request.ExpenseDate;
        expense.UpdatedAt = DateTime.UtcNow;

        await _expenseRepository.UpdateAsync(expense);

        return MapToResponse(expense);
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int expenseId)
    {
        var expense = await _expenseRepository.GetByIdAsync(userId, expenseId);
        if (expense == null)
        {
            return false;
        }
        await _expenseRepository.DeleteAsync(expense);
        return true;
    }

    private static ExpenseResponse MapToResponse(Expense expense)
    {
        return new ExpenseResponse
        {
            ExpenseId = expense.ExpenseId,
            CategoryId = expense.CategoryId,
            CategoryName = expense.Category?.Name ?? "Unknown",
            Amount = expense.Amount,
            Description = expense.Description,
            ExpenseDate = expense.ExpenseDate,
            CreatedAt = expense.CreatedAt,
            UpdatedAt = expense.UpdatedAt
        };
    }
}
