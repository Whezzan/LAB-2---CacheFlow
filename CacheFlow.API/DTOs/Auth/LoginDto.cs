using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.Auth;

public record LoginDto(
    [Required, EmailAddress] string Email,
    [Required]               string Password
);
