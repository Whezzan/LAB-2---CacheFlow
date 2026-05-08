using System.Security.Claims;
using CacheFlow.API.DTOs.Auction;
using CacheFlow.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CacheFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _auctionService;

    public AuctionsController(IAuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string? query,
        [FromQuery] bool    includeClosed = false)
    {
        var auctions = await _auctionService.SearchAsync(query, includeClosed, IsAdmin());
        return Ok(auctions);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var auction = await _auctionService.GetByIdAsync(id);
        if (auction == null) return NotFound(new { message = "Auction not found" });

        return Ok(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAuctionDto dto)
    {
        var auction = await _auctionService.CreateAsync(dto, GetCurrentUserId());
        return CreatedAtAction(nameof(GetById), new { id = auction.Id }, auction);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAuctionDto dto)
    {
        var (auction, error) = await _auctionService.UpdateAsync(id, dto, GetCurrentUserId(), IsAdmin());

        if (error == "Auction not found") return NotFound(new { message = error });
        if (error == "Forbidden")         return Forbid();
        if (error != null)                return BadRequest(new { message = error });

        return Ok(auction);
    }

    [Authorize]
    [HttpPatch("{id:int}/deactivate")]
    public async Task<IActionResult> Deactivate(int id)
    {
        if (!IsAdmin()) return Forbid();

        var success = await _auctionService.ToggleActiveAsync(id, false);
        if (!success) return NotFound(new { message = "Auction not found" });

        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id:int}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        if (!IsAdmin()) return Forbid();

        var success = await _auctionService.ToggleActiveAsync(id, true);
        if (!success) return NotFound(new { message = "Auction not found" });

        return NoContent();
    }

    // --- Helpers ---

    private int  GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin()          => User.FindFirstValue("isAdmin") == "True";
}
