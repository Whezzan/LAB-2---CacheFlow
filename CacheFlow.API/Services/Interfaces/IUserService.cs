using CacheFlow.API.DTOs.User;

namespace CacheFlow.API.Services.Interfaces;

public interface IUserService
{
    Task<UserDto?>             GetByIdAsync(int id);
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<(bool success, string? error)> UpdatePasswordAsync(int userId, UpdatePasswordDto dto);
    Task<bool>                 ToggleActiveAsync(int id, bool isActive);
}
