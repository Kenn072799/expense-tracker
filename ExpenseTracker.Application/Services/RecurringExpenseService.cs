using ExpenseTracker.Application.DTOs.RecurringExpenses;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class RecurringExpenseService : IRecurringExpenseService
{
    private readonly IRecurringExpenseRepository _recurringExpenseRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IExpenseRepository _expenseRepository;

    public RecurringExpenseService(
        IRecurringExpenseRepository recurringExpenseRepository,
        ICategoryRepository categoryRepository,
        IExpenseRepository expenseRepository)
    {
        _recurringExpenseRepository = recurringExpenseRepository;
        _categoryRepository = categoryRepository;
        _expenseRepository = expenseRepository;
    }

    public async Task<RecurringExpenseResponse> CreateAsync(
        int userId,
        CreateRecurringExpenseRequest request)
    {
        if (request.Amount <= 0)
        {
            throw new ArgumentException(
                "Amount must be greater than zero.");
        }

        var normalizedFrequency =
            NormalizeFrequency(request.Frequency);

        var startDate = request.StartDate.Date;
        var endDate = request.EndDate?.Date;

        if (endDate.HasValue &&
            endDate.Value < startDate)
        {
            throw new ArgumentException(
                "End date cannot be earlier than start date.");
        }

        var categories =
            await _categoryRepository.GetAllActiveAsync();

        var category =
            categories.FirstOrDefault(
                x => x.CategoryId == request.CategoryId);

        if (category is null)
        {
            throw new ArgumentException(
                "Category does not exist or is not active.");
        }

        var now = DateTime.UtcNow;

        var recurringExpense = new RecurringExpense
        {
            UserId = userId,

            CategoryId = request.CategoryId,

            Amount = request.Amount,

            Description = request.Description,

            Frequency = normalizedFrequency,

            StartDate = startDate,

            // First occurrence starts on StartDate.
            NextRunDate = startDate,

            EndDate = endDate,

            IsActive = true,

            CreatedAt = now,

            UpdatedAt = now
        };

        var created =
            await _recurringExpenseRepository.AddAsync(
                recurringExpense);

        return MapToResponse(
            created,
            category.Name);
    }

    public async Task<IEnumerable<RecurringExpenseResponse>> GetAllAsync(
        int userId)
    {
        var recurringExpenses =
            await _recurringExpenseRepository.GetAllByUserAsync(
                userId);

        return recurringExpenses.Select(
            recurringExpense =>
                MapToResponse(
                    recurringExpense,
                    recurringExpense.Category?.Name
                    ?? "Unknown"));
    }

    public async Task<RecurringExpenseResponse?> GetByIdAsync(
        int userId,
        int recurringExpenseId)
    {
        var recurringExpense =
            await _recurringExpenseRepository.GetByIdAsync(
                userId,
                recurringExpenseId);

        if (recurringExpense is null)
        {
            return null;
        }

        return MapToResponse(
            recurringExpense,
            recurringExpense.Category?.Name
            ?? "Unknown");
    }

    public async Task<RecurringExpenseResponse?> UpdateAsync(
        int userId,
        int recurringExpenseId,
        UpdateRecurringExpenseRequest request)
    {
        var recurringExpense =
            await _recurringExpenseRepository.GetByIdAsync(
                userId,
                recurringExpenseId);

        if (recurringExpense is null)
        {
            return null;
        }

        if (request.Amount <= 0)
        {
            throw new ArgumentException(
                "Amount must be greater than zero.");
        }

        var normalizedFrequency =
            NormalizeFrequency(request.Frequency);

        var endDate = request.EndDate?.Date;

        if (endDate.HasValue &&
            endDate.Value < recurringExpense.StartDate.Date)
        {
            throw new ArgumentException(
                "End date cannot be earlier than start date.");
        }

        var categories =
            await _categoryRepository.GetAllActiveAsync();

        var category =
            categories.FirstOrDefault(
                x => x.CategoryId == request.CategoryId);

        if (category is null)
        {
            throw new ArgumentException(
                "Selected category does not exist or is inactive.");
        }

        /*
         * Remember the previous active state.
         *
         * This allows us to know whether the user
         * is reactivating a previously paused schedule.
         */
        var wasInactive =
            !recurringExpense.IsActive;

        var isBeingReactivated =
            wasInactive && request.IsActive;

        recurringExpense.CategoryId =
            request.CategoryId;

        recurringExpense.Amount =
            request.Amount;

        recurringExpense.Description =
            request.Description;

        recurringExpense.Frequency =
            normalizedFrequency;

        recurringExpense.EndDate =
            endDate;

        recurringExpense.IsActive =
            request.IsActive;

        /*
         * When a recurring expense is reactivated,
         * we DO NOT generate expenses for all the
         * months/days that were missed while paused.
         *
         * Instead, move NextRunDate forward until
         * it reaches the next future occurrence.
         */
        if (isBeingReactivated)
        {
            var today = DateTime.UtcNow.Date;

            while (recurringExpense.NextRunDate.Date < today)
            {
                recurringExpense.NextRunDate =
                    CalculateNextRunDate(
                        recurringExpense.NextRunDate,
                        recurringExpense.Frequency);
            }
        }

        /*
         * If the next occurrence is already past
         * the configured EndDate, the schedule
         * should remain inactive.
         */
        if (recurringExpense.EndDate.HasValue &&
            recurringExpense.NextRunDate.Date >
            recurringExpense.EndDate.Value.Date)
        {
            recurringExpense.IsActive = false;
        }

        recurringExpense.UpdatedAt =
            DateTime.UtcNow;

        await _recurringExpenseRepository.UpdateAsync(
            recurringExpense);

        return MapToResponse(
            recurringExpense,
            category.Name);
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int recurringExpenseId)
    {
        var recurringExpense =
            await _recurringExpenseRepository.GetByIdAsync(
                userId,
                recurringExpenseId);

        if (recurringExpense is null)
        {
            return false;
        }

        await _recurringExpenseRepository.DeleteAsync(
            recurringExpense);

        return true;
    }

    public async Task<int> ProcessDueAsync()
    {
        /*
         * We use .Date because recurring expenses
         * in this app are calendar-date based.
         *
         * Example:
         * September 2 means September 2,
         * regardless of the current hour.
         */
        var today = DateTime.UtcNow.Date;

        var dueRecurringExpenses =
            await _recurringExpenseRepository.GetDueAsync(
                today);

        var processedCount = 0;

        foreach (var recurringExpense in dueRecurringExpenses)
        {
            /*
             * Catch up occurrences that were due
             * while the application was offline.
             *
             * Example:
             *
             * NextRunDate = July 1
             * Today       = September 2
             *
             * Creates:
             * July 1
             * August 1
             * September 1
             *
             * Then advances to October 1.
             */
            while (
                recurringExpense.IsActive &&
                recurringExpense.NextRunDate.Date <= today &&
                (!recurringExpense.EndDate.HasValue ||
                 recurringExpense.NextRunDate.Date <=
                 recurringExpense.EndDate.Value.Date))
            {
                var occurrenceDate =
                    recurringExpense.NextRunDate.Date;

                /*
                 * Idempotency check.
                 *
                 * Prevent the same recurring occurrence
                 * from creating the same expense twice.
                 */
                var occurrenceExists =
                    await _expenseRepository
                        .RecurringOccurrenceExistsAsync(
                            recurringExpense.RecurringExpenseId,
                            occurrenceDate);

                if (!occurrenceExists)
                {
                    var expense = new Expense
                    {
                        UserId =
                            recurringExpense.UserId,

                        CategoryId =
                            recurringExpense.CategoryId,

                        Amount =
                            recurringExpense.Amount,

                        Description =
                            recurringExpense.Description,

                        ExpenseDate =
                            occurrenceDate,

                        RecurringExpenseId =
                            recurringExpense.RecurringExpenseId,

                        RecurringOccurrenceDate =
                            occurrenceDate,

                        CreatedAt =
                            DateTime.UtcNow,

                        UpdatedAt =
                            DateTime.UtcNow
                    };

                    await _expenseRepository.AddAsync(
                        expense);

                    processedCount++;
                }

                /*
                 * Move to the next scheduled occurrence.
                 */
                recurringExpense.NextRunDate =
                    CalculateNextRunDate(
                        recurringExpense.NextRunDate,
                        recurringExpense.Frequency);
            }

            /*
             * Automatically deactivate once
             * the schedule passes its EndDate.
             */
            if (recurringExpense.EndDate.HasValue &&
                recurringExpense.NextRunDate.Date >
                recurringExpense.EndDate.Value.Date)
            {
                recurringExpense.IsActive = false;
            }

            recurringExpense.UpdatedAt =
                DateTime.UtcNow;

            await _recurringExpenseRepository.UpdateAsync(
                recurringExpense);
        }

        return processedCount;
    }

    private static string NormalizeFrequency(
        string frequency)
    {
        var allowedFrequencies = new[]
        {
            "Daily",
            "Weekly",
            "Monthly",
            "Yearly"
        };

        var normalizedFrequency =
            allowedFrequencies.FirstOrDefault(
                value =>
                    value.Equals(
                        frequency,
                        StringComparison.OrdinalIgnoreCase));

        if (normalizedFrequency is null)
        {
            throw new ArgumentException(
                "Frequency must be Daily, Weekly, Monthly, or Yearly.");
        }

        return normalizedFrequency;
    }

    private static DateTime CalculateNextRunDate(
        DateTime currentRunDate,
        string frequency)
    {
        return frequency switch
        {
            "Daily" =>
                currentRunDate.AddDays(1),

            "Weekly" =>
                currentRunDate.AddDays(7),

            "Monthly" =>
                currentRunDate.AddMonths(1),

            "Yearly" =>
                currentRunDate.AddYears(1),

            _ =>
                throw new InvalidOperationException(
                    "Unsupported recurring expense frequency.")
        };
    }

    private static RecurringExpenseResponse MapToResponse(
        RecurringExpense recurringExpense,
        string categoryName)
    {
        return new RecurringExpenseResponse
        {
            RecurringExpenseId =
                recurringExpense.RecurringExpenseId,

            CategoryId =
                recurringExpense.CategoryId,

            CategoryName =
                categoryName,

            Amount =
                recurringExpense.Amount,

            Description =
                recurringExpense.Description,

            Frequency =
                recurringExpense.Frequency,

            StartDate =
                recurringExpense.StartDate,

            NextRunDate =
                recurringExpense.NextRunDate,

            EndDate =
                recurringExpense.EndDate,

            IsActive =
                recurringExpense.IsActive,

            CreatedAt =
                recurringExpense.CreatedAt,

            UpdatedAt =
                recurringExpense.UpdatedAt
        };
    }
}