using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Application.DTOs.Expenses;

public class UpdateExpenseRequest
{
    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }

    [Range(typeof(decimal), "0.01", "9999999999999999.99")]
    public decimal Amount { get; set; }

    [MaxLength(255)]
    public string? Description { get; set; }

    public DateTime ExpenseDate { get; set; }
}