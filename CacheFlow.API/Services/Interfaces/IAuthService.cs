using CacheFlow.API.DTOs.Auth;

namespace CacheFlow.API.Services.Interfaces;

public interface IAuthService
{
    Task<(AuthResponseDto? response, string? error)> RegisterAsync(RegisterDto dto);
    Task<(AuthResponseDto? response, string? error)> LoginAsync(LoginDto dto);
}
