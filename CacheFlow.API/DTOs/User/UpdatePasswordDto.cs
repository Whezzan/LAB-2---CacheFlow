using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.User;

public record UpdatePasswordDto(
    [Required]               string CurrentPassword,
    [Required, MinLength(8)] string NewPassword
);
