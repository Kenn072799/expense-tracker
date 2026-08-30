using ExpenseTracker.Application.DTOs.Auth;
using ExpenseTracker.Application.Interfaces.Repositories;
using ExpenseTracker.Application.Interfaces.Services;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace ExpenseTracker.Tests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tokenServiceMock = new Mock<ITokenService>();

        _passwordHasher = new PasswordHasher<User>();

        _authService = new AuthService(
            _userRepositoryMock.Object,
            _passwordHasher,
            _tokenServiceMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_ValidRequest_ReturnsAuthResponse()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        _userRepositoryMock
            .Setup(x => x.EmailExistsAsync(request.Email))
            .ReturnsAsync(false);

        _userRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<User>()))
            .ReturnsAsync((User user) =>
            {
                user.UserId = 1;
                return user;
            });

        _tokenServiceMock
            .Setup(x => x.CreateToken(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        // Act
        var result =
            await _authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("fake-jwt-token", result.Token);

        _userRepositoryMock.Verify(
            x => x.AddAsync(It.Is<User>(u =>
                u.FirstName == "John" &&
                u.LastName == "Doe" &&
                u.Email == "john.doe@example.com")),
            Times.Once);

        _tokenServiceMock.Verify(
            x => x.CreateToken(It.IsAny<User>()),
            Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_EmailAlreadyExists_ThrowsInvalidOperationException()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        _userRepositoryMock
            .Setup(x => x.EmailExistsAsync(request.Email))
            .ReturnsAsync(true);

        // Act
        var exception =
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.RegisterAsync(request));

        // Assert
        Assert.Equal(
            "User with this email already exists.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var password = "Password123!";

        var user = new User
        {
            UserId = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com"
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, password);

        var request = new LoginRequest
        {
            Email = user.Email,
            Password = password
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync(user);

        _tokenServiceMock
            .Setup(x => x.CreateToken(user))
            .Returns("fake-jwt-token");

        // Act
        var result =
            await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("fake-jwt-token", result.Token);

        _tokenServiceMock.Verify(
            x => x.CreateToken(user),
            Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsArgumentException()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            Email = "john.doe@example.com"
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                "CorrectPassword123!");

        var request = new LoginRequest
        {
            Email = user.Email,
            Password = "WrongPassword!"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync(user);

        // Act
        var exception =
            await Assert.ThrowsAsync<ArgumentException>(
                () => _authService.LoginAsync(request));

        // Assert
        Assert.Equal(
            "Invalid email or password.",
            exception.Message);

        _tokenServiceMock.Verify(
            x => x.CreateToken(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_UserDoesNotExist_ThrowsArgumentException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "missing@test.com",
            Password = "Password123!"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        // Act
        var exception =
            await Assert.ThrowsAsync<ArgumentException>(
                () => _authService.LoginAsync(request));

        // Assert
        Assert.Equal(
            "Invalid email or password.",
            exception.Message);

        _tokenServiceMock.Verify(
            x => x.CreateToken(It.IsAny<User>()),
            Times.Never);
    }
}
