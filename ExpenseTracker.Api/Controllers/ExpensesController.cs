using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace ExpenseTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("general")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        private int GetCurrentUserId()
        {
            var userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdValue, out var userId))
            {
                throw new UnauthorizedAccessException(
                    "Invalid user token.");
            }

            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            CreateExpenseRequest request)
        {
            var userId = GetCurrentUserId();

            var result = 
                await _expenseService.CreateAsync(userId, request);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] ExpenseFilterRequest filter)
        {
            var userId = GetCurrentUserId();

            var result =
                await _expenseService.GetAllAsync(
                    userId,
                    filter);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetCurrentUserId();

            var result =
                await _expenseService.GetByIdAsync(userId, id);

            if(result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateExpenseRequest request)
        {
            var userId = GetCurrentUserId();

            var result =
                await _expenseService.UpdateAsync(
                    userId,
                    id,
                    request);

            if(result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();

            var deleted =
                await _expenseService.DeleteAsync(userId, id);

            if(!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
