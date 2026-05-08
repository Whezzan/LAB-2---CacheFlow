using CacheFlow.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CacheFlow.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var adminExists = await context.Users.AnyAsync(u => u.IsAdmin);
        if (adminExists) return;

        var adminUser = new User
        {
            Username     = "admin",
            Email        = "admin@cacheflow.se",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            IsAdmin      = true,
            IsActive     = true,
            CreatedAt    = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}
