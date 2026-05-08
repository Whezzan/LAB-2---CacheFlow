using CacheFlow.API.Data;
using CacheFlow.API.DTOs.Auction;
using CacheFlow.API.Models;
using CacheFlow.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CacheFlow.API.Services;

public class AuctionService : IAuctionService
{
    private readonly AppDbContext _context;

    public AuctionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AuctionDto>> SearchAsync(string? query, bool includeClosed, bool isAdmin)
    {
        var auctionsQuery = _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .AsQueryable();

        if (!isAdmin)
            auctionsQuery = auctionsQuery.Where(a => a.IsActive);

        if (!string.IsNullOrWhiteSpace(query))
            auctionsQuery = auctionsQuery.Where(a => a.Title.Contains(query));

        var now = DateTime.UtcNow;

        if (includeClosed)
            auctionsQuery = auctionsQuery.Where(a => a.EndDate <= now);
        else
            auctionsQuery = auctionsQuery.Where(a => a.EndDate > now);

        var auctions = await auctionsQuery
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return auctions.Select(MapToDto);
    }

    public async Task<AuctionDto?> GetByIdAsync(int id)
    {
        var auction = await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);

        return auction == null ? null : MapToDto(auction);
    }

    public async Task<AuctionDto> CreateAsync(CreateAuctionDto dto, int userId)
    {
        var auction = new Auction
        {
            Title         = dto.Title,
            Description   = dto.Description,
            StartingPrice = dto.StartingPrice,
            StartDate     = dto.StartDate,
            EndDate       = dto.EndDate,
            UserId        = userId,
            IsActive      = true,
            CreatedAt     = DateTime.UtcNow
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        await _context.Entry(auction).Reference(a => a.User).LoadAsync();

        return MapToDto(auction);
    }

    public async Task<(AuctionDto? auction, string? error)> UpdateAsync(
        int id, UpdateAuctionDto dto, int userId, bool isAdmin)
    {
        var auction = await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (auction == null)                          return (null, "Auction not found");
        if (!isAdmin && auction.UserId != userId)     return (null, "Forbidden");

        if (dto.StartingPrice.HasValue && dto.StartingPrice.Value != auction.StartingPrice)
        {
            if (auction.Bids.Count > 0)
                return (null, "Cannot change starting price when bids already exist");

            auction.StartingPrice = dto.StartingPrice.Value;
        }

        auction.Title       = dto.Title;
        auction.Description = dto.Description;
        auction.StartDate   = dto.StartDate;
        auction.EndDate     = dto.EndDate;

        await _context.SaveChangesAsync();

        return (MapToDto(auction), null);
    }

    public async Task<bool> ToggleActiveAsync(int id, bool isActive)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction == null) return false;

        auction.IsActive = isActive;
        await _context.SaveChangesAsync();
        return true;
    }

    // --- Helpers ---

    private static AuctionDto MapToDto(Auction auction)
    {
        var now              = DateTime.UtcNow;
        var highestBid       = auction.Bids.Count > 0 ? auction.Bids.Max(b => b.Amount) : 0;
        var isOpen           = auction.IsActive && auction.EndDate > now;

        return new AuctionDto
        {
            Id                = auction.Id,
            Title             = auction.Title,
            Description       = auction.Description,
            StartingPrice     = auction.StartingPrice,
            CurrentHighestBid = highestBid,
            StartDate         = auction.StartDate,
            EndDate           = auction.EndDate,
            IsOpen            = isOpen,
            IsActive          = auction.IsActive,
            UserId            = auction.UserId,
            SellerUsername    = auction.User?.Username ?? string.Empty,
            BidCount          = auction.Bids.Count,
            CreatedAt         = auction.CreatedAt
        };
    }
}
