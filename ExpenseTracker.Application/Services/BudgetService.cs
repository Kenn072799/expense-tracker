using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryRepository _categoryRepository;

    public BudgetService(
        IBudgetRepository budgetRepository,
        IExpenseRepository expenseRepository,
        ICategoryRepository categoryRepository)
    {
        _budgetRepository = budgetRepository;
        _expenseRepository = expenseRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<BudgetResponse> CreateAsync(
        int userId,
        CreateBudgetRequest request)
    {
        var category =
            await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category is null)
        {
            throw new InvalidOperationException("Category not found.");
        }

        if (request.Amount <= 0)
        {
            throw new InvalidOperationException(
                "Budget amount must be greater than zero.");
        }

        if (request.Month < 1 || request.Month > 12)
        {
            throw new InvalidOperationException(
                "Month must be between 1 and 12.");
        }

        if (request.Year < 2000)
        {
            throw new InvalidOperationException(
                "Year must be 2000 or later.");
        }

        var existingBudget =
            await _budgetRepository
                .GetByUserCategoryMonthYearAsync(
                    userId,
                    request.CategoryId,
                    request.Month,
                    request.Year);

        if (existingBudget is not null)
        {
            throw new InvalidOperationException(
                "A budget already exists for this category and month.");
        }

        var budget = new Budget
        {
            UserId = userId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            Month = request.Month,
            Year = request.Year,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdBudget =
            await _budgetRepository.AddAsync(budget);

        createdBudget.Category = category;

        return await MapToResponseAsync(createdBudget);
    }

    public async Task<IEnumerable<BudgetResponse>> GetAllAsync(
        int userId,
        int month,
        int year)
    {
        var budgets =
            await _budgetRepository.GetAllByUserAsync(
                userId,
                month,
                year);

        var responses = new List<BudgetResponse>();

        foreach (var budget in budgets)
        {
            responses.Add(
                await MapToResponseAsync(budget));
        }

        return responses;
    }

    public async Task<BudgetResponse?> GetByIdAsync(
        int userId,
        int budgetId)
    {
        var budget =
            await _budgetRepository.GetByIdAsync(
                userId,
                budgetId);

        if (budget is null)
        {
            return null;
        }

        return await MapToResponseAsync(budget);
    }

    public async Task<BudgetResponse?> UpdateAsync(
        int userId,
        int budgetId,
        UpdateBudgetRequest request)
    {
        var budget =
            await _budgetRepository.GetByIdAsync(
                userId,
                budgetId);

        if (budget is null)
        {
            return null;
        }

        if (request.Amount <= 0)
        {
            throw new InvalidOperationException(
                "Budget amount must be greater than zero.");
        }

        budget.Amount = request.Amount;
        budget.UpdatedAt = DateTime.UtcNow;

        await _budgetRepository.UpdateAsync(budget);

        return await MapToResponseAsync(budget);
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int budgetId)
    {
        var budget =
            await _budgetRepository.GetByIdAsync(
                userId,
                budgetId);

        if (budget is null)
        {
            return false;
        }

        await _budgetRepository.DeleteAsync(budget);

        return true;
    }

    private async Task<BudgetResponse> MapToResponseAsync(
        Budget budget)
    {
        var expenses =
            await _expenseRepository.GetByMonthAsync(
                budget.UserId,
                budget.Month,
                budget.Year);

        var spentAmount = expenses
            .Where(e => e.CategoryId == budget.CategoryId)
            .Sum(e => e.Amount);

        var remainingAmount =
            budget.Amount - spentAmount;

        var progressPercentage =
            budget.Amount > 0
                ? Math.Round(
                    spentAmount / budget.Amount * 100,
                    2)
                : 0;

        return new BudgetResponse
        {
            BudgetId = budget.BudgetId,
            CategoryId = budget.CategoryId,
            CategoryName =
                budget.Category?.Name ?? "Unknown",
            Amount = budget.Amount,
            Month = budget.Month,
            Year = budget.Year,
            SpentAmount = spentAmount,
            RemainingAmount = remainingAmount,
            ProgressPercentage = progressPercentage,
            CreatedAt = budget.CreatedAt,
            UpdatedAt = budget.UpdatedAt
        };
    }
}