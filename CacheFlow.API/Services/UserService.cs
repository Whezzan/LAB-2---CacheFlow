using CacheFlow.API.Data;
using CacheFlow.API.DTOs.User;
using CacheFlow.API.Models;
using CacheFlow.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CacheFlow.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user == null ? null : MapToDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _context.Users
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(MapToDto);
    }

    public async Task<(bool success, string? error)> UpdatePasswordAsync(int userId, UpdatePasswordDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return (false, "User not found");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return (false, "Current password is incorrect");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        return (true, null);
    }

    public async Task<bool> ToggleActiveAsync(int id, bool isActive)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.IsActive = isActive;
        await _context.SaveChangesAsync();
        return true;
    }

    // --- Helpers ---

    private static UserDto MapToDto(User user) => new()
    {
        Id        = user.Id,
        Username  = user.Username,
        Email     = user.Email,
        IsAdmin   = user.IsAdmin,
        IsActive  = user.IsActive,
        CreatedAt = user.CreatedAt
    };
}
