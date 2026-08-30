using ExpenseTracker.Application.DTOs.Dashboard;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(int userId);
}
