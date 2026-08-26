namespace RoomBooking.API.Models;

public class Booking
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public int DepartmentId { get; set; }

    public Department? Department { get; set; }

    public int RoomId { get; set; }

    public Room? Room { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public BookingStatus Status { get; set; }

    public string? RejectionReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}