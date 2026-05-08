using System.ComponentModel.DataAnnotations;

namespace CacheFlow.API.DTOs.Bid;

public record CreateBidDto(
    [Range(0.01, double.MaxValue)] decimal Amount
);
