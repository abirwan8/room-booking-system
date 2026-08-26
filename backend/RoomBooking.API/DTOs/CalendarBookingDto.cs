namespace RoomBooking.API.DTOs;

public class CalendarBookingDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int RoomId { get; set; }

    public string RoomName { get; set; } = string.Empty;

    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string Status { get; set; } = string.Empty;
}