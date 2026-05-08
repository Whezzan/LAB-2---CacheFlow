using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.Auction;

public record CreateAuctionDto(
    [Required, MinLength(3), MaxLength(200)] string   Title,
    [Required]                               string   Description,
    [Range(0.01, double.MaxValue)]           decimal  StartingPrice,
                                             DateTime StartDate,
                                             DateTime EndDate
);
