using ExpenseTracker.Application.DTOs.Auth;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;
using ExpenseTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ExpenseTracker.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(
        IUserRepository userRepository,
        PasswordHasher<User> passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new ArgumentException("Invalid email or password.");
        }

        var verificationResult = 
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if(verificationResult == PasswordVerificationResult.Failed)
        {
            throw new ArgumentException("Invalid email or password.");
        }

        return new AuthResponse
        {
            Token = _tokenService.CreateToken(user),
            Expiration = DateTime.UtcNow.AddMinutes(60) // 60 minutes token expiration time
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var userExists = await _userRepository.EmailExistsAsync(request.Email);

        if(userExists)
        {
            throw new InvalidOperationException(
                "User with this email already exists.");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.Password);

        var savedUser =
            await _userRepository.AddAsync(user);

        return new AuthResponse
        {
            Token = _tokenService.CreateToken(savedUser),
            Expiration = DateTime.UtcNow.AddMinutes(60) // 60 minutes token expiration time
        };
    }
}
