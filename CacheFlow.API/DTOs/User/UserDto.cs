namespace CacheFlow.API.DTOs.User;

public class UserDto
{
    public int      Id        { get; set; }
    public string   Username  { get; set; } = string.Empty;
    public string   Email     { get; set; } = string.Empty;
    public bool     IsAdmin   { get; set; }
    public bool     IsActive  { get; set; }
    public DateTime CreatedAt { get; set; }
}
