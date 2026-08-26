using RoomBooking.API.DTOs;
using RoomBooking.API.Models;
using Microsoft.EntityFrameworkCore;
namespace RoomBooking.API.Interfaces;

public interface IBookingService
{
    
    Task<IEnumerable<BookingListDto>> GetAllBookingsAsync();
    Task<IEnumerable<BookingListDto>> GetMyBookingsAsync(int userId);

    Task<(bool Success, string Message, Booking? Booking)> CreateBookingAsync(
        CreateBookingDto request,
        int userId
    );

    Task<IEnumerable<Booking>> GetCalendarAsync();

    Task<(bool Success, string Message)> ApproveBookingAsync(
    int bookingId
    );

    Task<(bool Success, string Message)> RejectBookingAsync(
        int bookingId
    );


    Task<(bool Success, string Message)> CancelBookingAsync(
    int bookingId,
    int userId
    );

    Task<(bool Success, string Message)> UpdateBookingStatusAsync(
    int bookingId,
    BookingStatus status
    );


    Task<List<CalendarBookingDto>> GetCalendarAsync(
    DateTime? startDate,
    DateTime? endDate
    );
}