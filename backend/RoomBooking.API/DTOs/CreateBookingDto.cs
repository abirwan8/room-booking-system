namespace RoomBooking.API.DTOs;

public class CreateBookingDto
{
    public int RoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}