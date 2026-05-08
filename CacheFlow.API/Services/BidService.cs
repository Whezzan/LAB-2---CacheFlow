using CacheFlow.API.Data;
using CacheFlow.API.DTOs.Bid;
using CacheFlow.API.Models;
using CacheFlow.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CacheFlow.API.Services;

public class BidService : IBidService
{
    private readonly AppDbContext _context;

    public BidService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BidDto>> GetByAuctionIdAsync(int auctionId)
    {
        var bids = await _context.Bids
            .Include(b => b.User)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .ToListAsync();

        return bids.Select(MapToDto);
    }

    public async Task<(BidDto? bid, string? error)> CreateAsync(int auctionId, CreateBidDto dto, int userId)
    {
        var auction = await _context.Auctions
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == auctionId);

        if (auction == null)                                              return (null, "Auction not found");
        if (!auction.IsActive || auction.EndDate <= DateTime.UtcNow)     return (null, "Auction is closed");
        if (auction.UserId == userId)                                     return (null, "You cannot bid on your own auction");

        var minimumBid = auction.Bids.Count > 0
            ? auction.Bids.Max(b => b.Amount)
            : auction.StartingPrice;

        if (dto.Amount <= minimumBid)
            return (null, $"Bid must be higher than the current highest bid of {minimumBid:C}");

        var bid = new Bid
        {
            Amount    = dto.Amount,
            AuctionId = auctionId,
            UserId    = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        await _context.Entry(bid).Reference(b => b.User).LoadAsync();

        return (MapToDto(bid), null);
    }

    public async Task<(bool success, string? error)> DeleteAsync(int auctionId, int bidId, int userId)
    {
        var auction = await _context.Auctions
            .FirstOrDefaultAsync(a => a.Id == auctionId);

        if (auction == null)                         return (false, "Auction not found");
        if (auction.EndDate <= DateTime.UtcNow)      return (false, "Cannot undo a bid on a closed auction");

        var bid = await _context.Bids
            .FirstOrDefaultAsync(b => b.Id == bidId && b.AuctionId == auctionId);

        if (bid == null)           return (false, "Bid not found");
        if (bid.UserId != userId)  return (false, "You can only remove your own bids");

        var latestBid = await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.CreatedAt)
            .FirstOrDefaultAsync();

        if (latestBid?.Id != bidId)
            return (false, "You can only remove the latest bid");

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();

        return (true, null);
    }

    // --- Helpers ---

    private static BidDto MapToDto(Bid bid) => new()
    {
        Id             = bid.Id,
        Amount         = bid.Amount,
        CreatedAt      = bid.CreatedAt,
        UserId         = bid.UserId,
        BidderUsername = bid.User?.Username ?? string.Empty,
        AuctionId      = bid.AuctionId
    };
}
