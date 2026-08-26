namespace RoomBooking.API.DTOs;
using RoomBooking.API.Models;

public class BookingListDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? UserName { get; set; }

    public int RoomId { get; set; }

    public string? RoomName { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}