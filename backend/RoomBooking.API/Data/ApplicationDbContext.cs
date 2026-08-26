using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Models;

namespace RoomBooking.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Booking>()
        .HasIndex(b => new
        {
            b.RoomId,
            b.StartTime,
            b.EndTime,
            b.Status
        });
    }
}