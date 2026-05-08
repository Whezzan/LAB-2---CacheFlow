namespace CacheFlow.API.DTOs.Auth;

public record AuthResponseDto(
    string Token,
    int    UserId,
    string Username,
    bool   IsAdmin
);
