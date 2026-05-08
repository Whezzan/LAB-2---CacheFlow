using CacheFlow.API.DTOs.Auction;

namespace CacheFlow.API.Services.Interfaces;

public interface IAuctionService
{
    Task<IEnumerable<AuctionDto>> SearchAsync(string? query, bool includeClosed, bool isAdmin);
    Task<AuctionDto?>             GetByIdAsync(int id);
    Task<AuctionDto>              CreateAsync(CreateAuctionDto dto, int userId);
    Task<(AuctionDto? auction, string? error)> UpdateAsync(int id, UpdateAuctionDto dto, int userId, bool isAdmin);
    Task<bool>                    ToggleActiveAsync(int id, bool isActive);
}
