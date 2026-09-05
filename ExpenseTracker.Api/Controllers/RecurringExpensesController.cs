using ExpenseTracker.Application.DTOs.RecurringExpenses;
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
    public class RecurringExpensesController : ControllerBase
    {
        private readonly IRecurringExpenseService _recurringExpenseService;

        public RecurringExpensesController(
            IRecurringExpenseService recurringExpenseService)
        {
            _recurringExpenseService = recurringExpenseService;
        }

        [HttpPost]
        public async Task<ActionResult<RecurringExpenseResponse>> Create(
            CreateRecurringExpenseRequest request)
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result =
                await _recurringExpenseService.CreateAsync(
                    userId.Value,
                    request);

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecurringExpenseResponse>>> GetAll()
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result =
                await _recurringExpenseService.GetAllAsync(
                    userId.Value);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RecurringExpenseResponse>> GetById(
            int id)
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result =
                await _recurringExpenseService.GetByIdAsync(
                    userId.Value,
                    id);

            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<RecurringExpenseResponse>> Update(
            int id,
            UpdateRecurringExpenseRequest request)
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result =
                await _recurringExpenseService.UpdateAsync(
                    userId.Value,
                    id,
                    request);

            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var userId = GetUserId();

            if (userId is null)
            {
                return Unauthorized();
            }

            var deleted =
                await _recurringExpenseService.DeleteAsync(
                    userId.Value,
                    id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
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
