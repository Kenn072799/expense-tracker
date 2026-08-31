using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace ExpenseTracker.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableRateLimiting("general")]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetsController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetResponse>>> GetAll(
    [FromQuery] int month,
    [FromQuery] int year)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var budgets =
            await _budgetService.GetAllAsync(
                userId.Value,
                month,
                year);

        return Ok(budgets);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetResponse>> Create(
        CreateBudgetRequest request)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var budget =
            await _budgetService.CreateAsync(
                userId.Value,
                request);

        return Ok(budget);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BudgetResponse>> GetById(int id)
    {
        var userId = GetUserId();

        if(userId is null)
        {
            return Unauthorized();
        }

        var budget =
            await _budgetService.GetByIdAsync(
                userId.Value,
                id);

        if(budget is null)
        {
            return NotFound();
        }

        return Ok(budget);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<BudgetResponse>> Update(
        int id,
        UpdateBudgetRequest request)
    {
        var userId = GetUserId();

        if(userId is null)
        {
            return Unauthorized();
        }

        var budget = 
            await _budgetService.UpdateAsync(
                userId.Value,
                id,
                request);

        if(budget is null)
        {
            return NotFound();
        }

        return Ok(budget);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        if(userId is null)
        {
            return Unauthorized();
        }

        var deleted =
            await _budgetService.DeleteAsync(
                userId.Value,
                id);

        if(!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private int? GetUserId()
    {
        var userIdClaim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if(!int.TryParse(userIdClaim, out var userId))
        {
            return null;
        }

        return userId;
    }

}
