using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.Auth;

public record RegisterDto(
    [Required, MinLength(3), MaxLength(50)] string Username,
    [Required, EmailAddress]               string Email,
    [Required, MinLength(8)]               string Password
);
