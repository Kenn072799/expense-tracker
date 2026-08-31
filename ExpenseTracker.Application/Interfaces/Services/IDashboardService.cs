using ExpenseTracker.Application.DTOs.Dashboard;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(int userId);

    Task<IEnumerable<BudgetAlertResponse>> GetBudgetAlertsAsync(int userId);
}
