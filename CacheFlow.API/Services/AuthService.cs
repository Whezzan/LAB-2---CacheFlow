using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CacheFlow.API.Data;
using CacheFlow.API.DTOs.Auth;
using CacheFlow.API.Models;
using CacheFlow.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CacheFlow.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext    _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context       = context;
        _configuration = configuration;
    }

    public async Task<(AuthResponseDto? response, string? error)> RegisterAsync(RegisterDto dto)
    {
        var emailTaken    = await _context.Users.AnyAsync(u => u.Email    == dto.Email);
        var usernameTaken = await _context.Users.AnyAsync(u => u.Username == dto.Username);

        if (emailTaken)    return (null, "Email is already registered");
        if (usernameTaken) return (null, "Username is already taken");

        var user = new User
        {
            Username     = dto.Username,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsAdmin      = false,
            IsActive     = true,
            CreatedAt    = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token    = GenerateJwtToken(user);
        var response = new AuthResponseDto(token, user.Id, user.Username, user.IsAdmin);
        return (response, null);
    }

    public async Task<(AuthResponseDto? response, string? error)> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)                                           return (null, "Invalid email or password");
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return (null, "Invalid email or password");
        if (!user.IsActive)                                         return (null, "Account is deactivated");

        var token    = GenerateJwtToken(user);
        var response = new AuthResponseDto(token, user.Id, user.Username, user.IsAdmin);
        return (response, null);
    }

    // --- Helpers ---

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name,           user.Username),
            new Claim(ClaimTypes.Email,          user.Email),
            new Claim("isAdmin",                 user.IsAdmin.ToString())
        };

        var secret      = _configuration["JwtSettings:Secret"]!;
        var issuer      = _configuration["JwtSettings:Issuer"]!;
        var audience    = _configuration["JwtSettings:Audience"]!;
        var expiresDays = int.Parse(_configuration["JwtSettings:ExpirationInDays"] ?? "7");

        var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             issuer,
            audience:           audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddDays(expiresDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
