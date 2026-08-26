using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.DTOs;
using RoomBooking.API.Interfaces;
using RoomBooking.API.Models;

namespace RoomBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _context;

    public BookingService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookingListDto>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Room)
            .Select(b => new BookingListDto
            {
                Id = b.Id,

                UserId = b.UserId,
                UserName = b.User.Name,

                RoomId = b.RoomId,
                RoomName = b.Room.Name,

                Title = b.Title,
                Description = b.Description,

                StartTime = b.StartTime,
                EndTime = b.EndTime,

                Status = b.Status,

                CreatedAt = b.CreatedAt
            })
            .ToListAsync();
    }

    // User
    public async Task<IEnumerable<BookingListDto>> GetMyBookingsAsync(int userId)
    {
        return await _context.Bookings
            .Where(b => b.UserId == userId)
            .Include(b => b.Room)
            .Include(b => b.User)
            .Select(b => new BookingListDto
            {
                Id = b.Id,

                UserId = b.UserId,
                UserName = b.User.Name,

                RoomId = b.RoomId,
                RoomName = b.Room.Name,

                Title = b.Title,
                Description = b.Description,

                StartTime = b.StartTime,
                EndTime = b.EndTime,

                Status = b.Status,

                CreatedAt = b.CreatedAt
            })
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<(bool Success, string Message, Booking? Booking)> CreateBookingAsync(
        CreateBookingDto request,
        int userId)
    {
        // 1. Validasi waktu
        if (request.StartTime >= request.EndTime)
        {
            return (
                false,
                "Start time must be earlier than end time.",
                null
            );
        }

        // 2. Pastikan room tersedia
        var roomExists = await _context.Rooms
            .AnyAsync(r => r.Id == request.RoomId);

        if (!roomExists)
        {
            return (
                false,
                "Room not found.",
                null
            );
        }

        // 3. Cari department user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return (
                false,
                "User not found.",
                null
            );
        }

        // 4. COLLISION DETECTION
        var hasConflict = await _context.Bookings
            .AnyAsync(b =>
                b.RoomId == request.RoomId &&

                (
                    b.Status == BookingStatus.Pending ||
                    b.Status == BookingStatus.Approved
                ) &&

                b.StartTime < request.EndTime &&
                b.EndTime > request.StartTime
            );

        if (hasConflict)
        {
            return (
                false,
                "The room is already booked during the selected time.",
                null
            );
        }

        // 5. Buat booking
        var booking = new Booking
        {
            UserId = user.Id,
            DepartmentId = user.DepartmentId,
            RoomId = request.RoomId,
            Title = request.Title,
            Description = request.Description,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = BookingStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);

        await _context.SaveChangesAsync();

        return (
            true,
            "Booking submitted successfully.",
            booking
        );
    }

    public async Task<(bool Success, string Message)> ApproveBookingAsync(
    int bookingId)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
        {
            return (false, "Booking not found.");
        }

        if (booking.Status != BookingStatus.Pending)
        {
            return (
                false,
                "Only pending bookings can be approved."
            );
        }

        // Cek apakah ada booking APPROVED
        // yang waktunya bertabrakan pada room yang sama.
        var hasConflict = await _context.Bookings
            .AnyAsync(b =>
                b.Id != booking.Id &&
                b.RoomId == booking.RoomId &&
                b.Status == BookingStatus.Approved &&
                booking.StartTime < b.EndTime &&
                booking.EndTime > b.StartTime
            );

        if (hasConflict)
        {
            return (
                false,
                "The room is already booked during the selected time."
            );
        }

        booking.Status = BookingStatus.Approved;

        await _context.SaveChangesAsync();

        return (
            true,
            "Booking approved successfully."
        );
    }

    public async Task<(bool Success, string Message)> CancelBookingAsync(
    int bookingId,
    int userId)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b =>
                b.Id == bookingId &&
                b.UserId == userId
            );

        if (booking == null)
        {
            return (
                false,
                "Booking not found."
            );
        }

        if (booking.Status != BookingStatus.Pending &&
            booking.Status != BookingStatus.Approved)
        {
            return (
                false,
                "Only pending or approved bookings can be cancelled."
            );
        }

        booking.Status = BookingStatus.Cancelled;

        await _context.SaveChangesAsync();

        return (
            true,
            "Booking cancelled successfully."
        );
    }

    public async Task<(bool Success, string Message)> RejectBookingAsync(
    int bookingId)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
        {
            return (false, "Booking not found.");
        }

        if (booking.Status != BookingStatus.Pending)
        {
            return (
                false,
                "Only pending bookings can be rejected."
            );
        }

        booking.Status = BookingStatus.Rejected;

        await _context.SaveChangesAsync();

        return (
            true,
            "Booking rejected successfully."
        );
    }

    public async Task<(bool Success, string Message)> UpdateBookingStatusAsync(
    int bookingId,
    BookingStatus status)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
        {
            return (false, "Booking not found.");
        }

        booking.Status = status;

        await _context.SaveChangesAsync();

        return (true, "Booking status updated successfully.");
    }

    public async Task<IEnumerable<Booking>> GetCalendarAsync()
    {
        return await _context.Bookings
            .Include(b => b.Room)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<List<CalendarBookingDto>> GetCalendarAsync(
    DateTime? startDate,
    DateTime? endDate)
    {
        var query = _context.Bookings
            .AsNoTracking()
            .Include(b => b.Room)
            .Include(b => b.User)
            .Where(b =>
                b.Status == BookingStatus.Approved
            );

        if (startDate.HasValue)
        {
            query = query.Where(b =>
                b.EndTime >= startDate.Value
            );
        }

        if (endDate.HasValue)
        {
            query = query.Where(b =>
                b.StartTime <= endDate.Value
            );
        }

        return await query
            .OrderBy(b => b.StartTime)
            .Select(b => new CalendarBookingDto
            {
                Id = b.Id,

                Title = b.Title,

                Description = b.Description,

                RoomId = b.RoomId,

                RoomName = b.Room != null
                    ? b.Room.Name
                    : string.Empty,

                UserId = b.UserId,

                UserName = b.User != null
                    ? b.User.Name
                    : string.Empty,

                StartTime = b.StartTime,

                EndTime = b.EndTime,

                Status = b.Status.ToString()
            })
            .ToListAsync();
    }
}