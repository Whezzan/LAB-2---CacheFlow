using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.Auction;

public record UpdateAuctionDto(
    [Required, MinLength(3), MaxLength(200)] string    Title,
    [Required]                               string    Description,
                                             DateTime  StartDate,
                                             DateTime  EndDate,
    [Range(0.01, double.MaxValue)]           decimal?  StartingPrice
);
