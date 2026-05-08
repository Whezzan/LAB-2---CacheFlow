using System.Security.Claims;
using CacheFlow.API.DTOs.User;
using CacheFlow.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CacheFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userService.GetByIdAsync(GetCurrentUserId());
        if (user == null) return NotFound();

        return Ok(user);
    }

    [Authorize]
    [HttpPut("me/password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto dto)
    {
        var (success, error) = await _userService.UpdatePasswordAsync(GetCurrentUserId(), dto);
        if (error != null) return BadRequest(new { message = error });

        return NoContent();
    }

    // --- Admin endpoints ---

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!IsAdmin()) return Forbid();

        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [Authorize]
    [HttpPatch("{id:int}/deactivate")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        if (!IsAdmin()) return Forbid();

        var success = await _userService.ToggleActiveAsync(id, false);
        if (!success) return NotFound(new { message = "User not found" });

        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id:int}/activate")]
    public async Task<IActionResult> ActivateUser(int id)
    {
        if (!IsAdmin()) return Forbid();

        var success = await _userService.ToggleActiveAsync(id, true);
        if (!success) return NotFound(new { message = "User not found" });

        return NoContent();
    }

    // --- Helpers ---

    private int  GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin()          => User.FindFirstValue("isAdmin") == "True";
}
