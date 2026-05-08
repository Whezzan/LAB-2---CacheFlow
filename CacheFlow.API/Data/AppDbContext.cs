using CacheFlow.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CacheFlow.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User>    Users    => Set<User>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Bid>     Bids     => Set<Bid>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // --- User ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(256);
            entity.Property(u => u.Username).HasMaxLength(100);
        });

        // --- Auction ---
        modelBuilder.Entity<Auction>(entity =>
        {
            entity.Property(a => a.Title).HasMaxLength(200);
            entity.Property(a => a.StartingPrice).HasColumnType("decimal(18,2)");

            entity.HasOne(a => a.User)
                  .WithMany(u => u.Auctions)
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- Bid ---
        modelBuilder.Entity<Bid>(entity =>
        {
            entity.Property(b => b.Amount).HasColumnType("decimal(18,2)");

            entity.HasOne(b => b.Auction)
                  .WithMany(a => a.Bids)
                  .HasForeignKey(b => b.AuctionId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Restrict to avoid multiple cascade paths (User -> Auction -> Bid and User -> Bid)
            entity.HasOne(b => b.User)
                  .WithMany(u => u.Bids)
                  .HasForeignKey(b => b.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}
