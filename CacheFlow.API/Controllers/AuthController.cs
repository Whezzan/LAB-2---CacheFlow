using CacheFlow.API.DTOs.Auth;
using CacheFlow.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CacheFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var (response, error) = await _authService.RegisterAsync(dto);
        if (error != null) return Conflict(new { message = error });

        return CreatedAtAction(nameof(Register), response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var (response, error) = await _authService.LoginAsync(dto);
        if (error != null) return Unauthorized(new { message = error });

        return Ok(response);
    }
}
