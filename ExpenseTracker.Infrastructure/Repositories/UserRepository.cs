using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ExpenseTrackerDbContext _context;

    public UserRepository(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<User> AddAsync(User user)
    {
        var addedUser = await _context.Users.AddAsync(user);

        await _context.SaveChangesAsync();

        return addedUser.Entity;
    }
    public async Task<bool> EmailExistsAsync(string email)
    {
        var exists = await _context.Users
            .AnyAsync(x => x.Email == email);

        return exists;
    }
    public async Task<User?> GetByEmailAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        return user;
    }
    public async Task<User?> GetByIdAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == userId);
        return user;
    }
}