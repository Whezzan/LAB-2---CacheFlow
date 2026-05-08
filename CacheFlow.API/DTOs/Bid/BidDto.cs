namespace CacheFlow.API.DTOs.Bid;

public class BidDto
{
    public int      Id              { get; set; }
    public decimal  Amount          { get; set; }
    public DateTime CreatedAt       { get; set; }
    public int      UserId          { get; set; }
    public string   BidderUsername  { get; set; } = string.Empty;
    public int      AuctionId       { get; set; }
}
