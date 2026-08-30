using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces.Services;

public interface ITokenService
{
    string CreateToken(User user);
}
