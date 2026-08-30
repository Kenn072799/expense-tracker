using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Domain.Entities;
using Moq;

namespace ExpenseTracker.Tests;

public class ExpenseServiceTests
{
    private readonly Mock<IExpenseRepository> _expenseRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly ExpenseService _expenseService;

    public ExpenseServiceTests()
    {
        _expenseRepositoryMock = new Mock<IExpenseRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        _expenseService = new ExpenseService(
            _expenseRepositoryMock.Object,
            _categoryRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ValidRequest_ReturnsExpenseResponse()
    {
        // Arrange
        var userId = 1;

        var request = new CreateExpenseRequest
        {
            CategoryId = 1,
            Amount = 250,
            Description = "Dinner",
            ExpenseDate = DateTime.UtcNow
        };

        var category = new Category
        {
            CategoryId = 1,
            Name = "Food",
            IsActive = true
        };

        var savedExpense = new Expense
        {
            ExpenseId = 10,
            UserId = userId,
            CategoryId = 1,
            Category = category,
            Amount = 250,
            Description = "Dinner",
            ExpenseDate = request.ExpenseDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(request.CategoryId))
            .ReturnsAsync(category);

        _expenseRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Expense>()))
            .ReturnsAsync(savedExpense);

        // Act
        var result = await _expenseService.CreateAsync(
            userId,
            request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.ExpenseId);
        Assert.Equal(1, result.CategoryId);
        Assert.Equal("Food", result.CategoryName);
        Assert.Equal(250, result.Amount);
        Assert.Equal("Dinner", result.Description);
    }

    [Fact]
    public async Task CreateAsync_InvalidCategory_ThrowsArgumentExeception()
    {
        var userId = 1;

        var request = new CreateExpenseRequest
        {
            CategoryId = 999,
            Amount = 250m,
            Description = "Dinner",
            ExpenseDate = DateTime.UtcNow
        };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(request.CategoryId))
            .ReturnsAsync((Category?)null);

        // Act
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _expenseService.CreateAsync(userId, request));

        // Assert
        Assert.Equal(
            "Category does not exist or is inactive.",
            exception.Message);

        _expenseRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<Expense>()),
            Times.Never);
    }

    [Fact]
    public async Task GetByIdAsync_ExpenseExists_ReturnsExpenseResponse()
    {
        // Arrange
        var userId = 1;
        var expenseId = 10;

        var category = new Category
        {
            CategoryId = 1,
            Name = "Food",
            IsActive = true
        };

        var expense = new Expense
        {
            ExpenseId = expenseId,
            UserId = userId,
            CategoryId = 1,
            Category = category,
            Amount = 500m,
            Description = "Groceries",
            ExpenseDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync(expense);

        // Act
        var result =
            await _expenseService.GetByIdAsync(userId, expenseId);

        // Assert
        Assert.NotNull(result);

        Assert.Equal(expenseId, result.ExpenseId);
        Assert.Equal(1, result.CategoryId);
        Assert.Equal("Food", result.CategoryName);
        Assert.Equal(500m, result.Amount);
        Assert.Equal("Groceries", result.Description);
    }

    [Fact]
    public async Task GetByIdAsync_ExpenseDoesNotExist_ReturnsNull()
    {
        // Arrange
        var userId = 1;
        var expenseId = 999;

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync((Expense?)null);

        // Act
        var result =
            await _expenseService.GetByIdAsync(
                userId,
                expenseId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ValidRequest_ReturnUpdateExpense()
    {
        // Arrange
        var userId = 1;
        var expenseId = 10;

        var oldCategory = new Category
        {
            CategoryId = 1,
            Name = "Food",
            IsActive = true
        };

        var newCategory = new Category
        {
            CategoryId = 2,
            Name = "Transportation",
            IsActive = true
        };

        var expense = new Expense
        {
            ExpenseId = expenseId,
            UserId = userId,
            CategoryId = 1,
            Category = oldCategory,
            Amount = 250m,
            Description = "Dinner",
            ExpenseDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var request = new UpdateExpenseRequest
        {
            CategoryId = 2,
            Amount = 500m,
            Description = "Gas",
            ExpenseDate = DateTime.UtcNow
        };

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync(expense);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(request.CategoryId))
            .ReturnsAsync(newCategory);

        _expenseRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<Expense>()))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _expenseService.UpdateAsync(
                userId,
                expenseId,
                request);

        // Assert
        Assert.NotNull(result);

        Assert.Equal(2, result.CategoryId);
        Assert.Equal("Transportation", result.CategoryName);
        Assert.Equal(500m, result.Amount);
        Assert.Equal("Gas", result.Description);

        _expenseRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<Expense>(e =>
                e.ExpenseId == expenseId &&
                e.CategoryId == 2 &&
                e.Amount == 500m &&
                e.Description == "Gas")),
            Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ExpenseDoesNotExist_ReturnNull()
    {
        // Arrange
        var userId = 1;
        var expenseId = 999;

        var request = new UpdateExpenseRequest
        {
            CategoryId = 1,
            Amount = 500m,
            Description = "Test",
            ExpenseDate = DateTime.UtcNow
        };

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync((Expense?)null);

        // Act
        var result =
            await _expenseService.UpdateAsync(
                userId,
                expenseId,
                request);

        // Assert
        Assert.Null(result);

        _expenseRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<Expense>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_InvalidCategory_ThrowsArgumentException()
    {
        // Arrange
        var userId = 1;
        var expenseId = 10;

        var expense = new Expense
        {
            ExpenseId = expenseId,
            UserId = userId,
            CategoryId = 1,
            Amount = 250m
        };

        var request = new UpdateExpenseRequest
        {
            CategoryId = 999,
            Amount = 500m,
            Description = "Test",
            ExpenseDate = DateTime.UtcNow
        };

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync(expense);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(request.CategoryId))
            .ReturnsAsync((Category?)null);

        // Act
        var exception =
            await Assert.ThrowsAsync<ArgumentException>(
                () => _expenseService.UpdateAsync(
                    userId,
                    expenseId,
                    request));

        // Assert
        Assert.Equal(
            "Category does not exist or is inactive.",
            exception.Message);

        _expenseRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<Expense>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_ExpenseExists_ReturnsTrue()
    {
        // Arrange
        var userId = 1;
        var expenseId = 10;

        var expense = new Expense
        {
            ExpenseId = expenseId,
            UserId = userId
        };

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync(expense);

        _expenseRepositoryMock
            .Setup(x => x.DeleteAsync(expense))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _expenseService.DeleteAsync(userId, expenseId);

        // Assert
        Assert.True(result);

        _expenseRepositoryMock.Verify(
            x => x.DeleteAsync(expense),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ExpenseDoesNotExist_ReturnsFalse()
    {
        // Arrange
        var userId = 1;
        var expenseId = 999;

        _expenseRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, expenseId))
            .ReturnsAsync((Expense?)null);

        // Act
        var result =
            await _expenseService.DeleteAsync(userId, expenseId);

        // Assert
        Assert.False(result);

        _expenseRepositoryMock.Verify(
            x => x.DeleteAsync(It.IsAny<Expense>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_ValidRequest_ReturnsPagedResponse()
    {
        // Arrange
        var userId = 1;
        var page = 1;
        var pageSize = 10;

        var filter = new ExpenseFilterRequest
        {
            Page = page,
            PageSize = pageSize
        };

        var category = new Category
        {
            CategoryId = 1,
            Name = "Food",
            IsActive = true
        };

        var expenses = new List<Expense>
        {
            new Expense
            {
                ExpenseId = 1,
                UserId = userId,
                CategoryId = 1,
                Category = category,
                Amount = 250m,
                Description = "Dinner",
                ExpenseDate = DateTime.UtcNow
            },

            new Expense
            {
                ExpenseId = 2,
                UserId = userId,
                CategoryId = 1,
                Category = category,
                Amount = 500m,
                Description = "Groceries",
                ExpenseDate = DateTime.UtcNow
            }
        };

        // Pretend the user has 47 total expenses
        var totalCount = 47;

        _expenseRepositoryMock
            .Setup(x => x.GetAllByUserIdAsync(
                userId,
                filter))
            .ReturnsAsync(expenses);

        _expenseRepositoryMock
            .Setup(x => x.CountByUserIdAsync(
                userId,
                filter))
            .ReturnsAsync(totalCount);

        // Act
        var result =
            await _expenseService.GetAllAsync(
                userId,
                filter);

        // Assert
        Assert.NotNull(result);

        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(47, result.TotalCount);

        // 47 / 10 = 4.7
        // Ceiling = 5 pages
        Assert.Equal(5, result.TotalPages);

        Assert.Equal(2, result.Items.Count());
    }
}
