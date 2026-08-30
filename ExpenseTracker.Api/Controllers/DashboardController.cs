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
            var userIdCliam = User.FindFirst(
                ClaimTypes.NameIdentifier
                )?.Value;

            if(!int.TryParse( userIdCliam, out var userId))
            {
                return Unauthorized();
            }

            var dashboard = 
                await _dashboardService.GetDashboardAsync(userId);

            return Ok(dashboard);
        }
    }
}
