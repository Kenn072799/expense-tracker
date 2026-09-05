using ExpenseTracker.Application.Interfaces.Services;

namespace ExpenseTracker.Api.BackgroundServices;

public class RecurringExpenseBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RecurringExpenseBackgroundService> _logger;

    public RecurringExpenseBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<RecurringExpenseBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();

                var recurringExpenseService =
                    scope.ServiceProvider
                        .GetRequiredService<IRecurringExpenseService>();

                var processedCount =
                    await recurringExpenseService.ProcessDueAsync();

                if (processedCount > 0)
                {
                    _logger.LogInformation(
                        "Processed {Count} recurring expenses.",
                        processedCount);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while processing recurring expenses.");
            }

            await Task.Delay(
                TimeSpan.FromHours(1),
                stoppingToken);
        }
    }
}
