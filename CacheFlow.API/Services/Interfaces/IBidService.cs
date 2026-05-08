using CacheFlow.API.DTOs.Bid;

namespace CacheFlow.API.Services.Interfaces;

public interface IBidService
{
    Task<IEnumerable<BidDto>>              GetByAuctionIdAsync(int auctionId);
    Task<(BidDto? bid, string? error)>     CreateAsync(int auctionId, CreateBidDto dto, int userId);
    Task<(bool success, string? error)>    DeleteAsync(int auctionId, int bidId, int userId);
}
