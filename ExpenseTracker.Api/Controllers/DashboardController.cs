using ExpenseTracker.Application.DTOs.Dashboard;
using ExpenseTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace ExpenseTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("general")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardResponse>> GetDashboard()
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }


            var dashboard =
                await _dashboardService.GetDashboardAsync(userId.Value);

            return Ok(dashboard);
        }

        [HttpGet("budget-alerts")]
        public async Task<ActionResult<IEnumerable<BudgetAlertResponse>>> GetBudgetAlerts()
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var alerts = await _dashboardService.GetBudgetAlertsAsync(userId.Value);

            return Ok(alerts);
        }

        private int? GetUserId()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return null;
            }

            return userId;
        }
    }


}
