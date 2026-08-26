namespace RoomBooking.API.Models;

public class Room
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Capacity { get; set; }

    public string? Facilities { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Booking> Bookings { get; set; }
        = new List<Booking>();
}