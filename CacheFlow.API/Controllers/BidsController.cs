using System.Security.Claims;
using CacheFlow.API.DTOs.Bid;
using CacheFlow.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CacheFlow.API.Controllers;

[ApiController]
[Route("api/auctions/{auctionId:int}/bids")]
public class BidsController : ControllerBase
{
    private readonly IBidService _bidService;

    public BidsController(IBidService bidService)
    {
        _bidService = bidService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByAuction(int auctionId)
    {
        var bids = await _bidService.GetByAuctionIdAsync(auctionId);
        return Ok(bids);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> PlaceBid(int auctionId, [FromBody] CreateBidDto dto)
    {
        var (bid, error) = await _bidService.CreateAsync(auctionId, dto, GetCurrentUserId());

        if (error == "Auction not found") return NotFound(new { message = error });
        if (error != null)                return BadRequest(new { message = error });

        return CreatedAtAction(nameof(GetByAuction), new { auctionId }, bid);
    }

    [Authorize]
    [HttpDelete("{bidId:int}")]
    public async Task<IActionResult> UndoBid(int auctionId, int bidId)
    {
        var (success, error) = await _bidService.DeleteAsync(auctionId, bidId, GetCurrentUserId());

        if (error == "Auction not found") return NotFound(new { message = error });
        if (error == "Bid not found")     return NotFound(new { message = error });
        if (error != null)                return BadRequest(new { message = error });

        return NoContent();
    }

    // --- Helpers ---

    private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
