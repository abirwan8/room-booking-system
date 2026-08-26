using Microsoft.AspNetCore.Mvc;
using RoomBooking.API.DTOs;
using RoomBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.Models;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/v1/bookings")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();

        return Ok(new
        {
            success = true,
            data = bookings
        });
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "User identity not found."
            });
        }

        if (!int.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid user identity."
            });
        }

        var bookings = await _bookingService
            .GetMyBookingsAsync(userId);

        return Ok(new
        {
            success = true,
            data = bookings
        });
    }

    // POST: api/v1/bookings
    [Authorize(Roles = "User,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateBooking(
        [FromBody] CreateBookingDto request)
    {
        // User ID akan diambil dari JWT setelah authentication dibuat.
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier
        );

        if (userIdClaim == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "User identity not found."
            });
        }

        var userId = int.Parse(userIdClaim.Value);

        var result = await _bookingService.CreateBookingAsync(
            request,
            userId
        );

        // Jika gagal
        if (!result.Success)
        {
            // User atau Room tidak ditemukan
            if (result.Message == "Room not found." ||
                result.Message == "User not found.")
            {
                return NotFound(new
                {
                    success = false,
                    message = result.Message
                });
            }

            // Terjadi collision
            if (result.Message.Contains("already booked"))
            {
                return Conflict(new
                {
                    success = false,
                    message = result.Message
                });
            }

            // Error validasi lainnya
            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        var booking = result.Booking!;

        // Jangan return entity Booking langsung,
        // karena navigation properties dapat menyebabkan
        // circular reference ketika di-serialize ke JSON.
        return StatusCode(201, new
        {
            success = true,
            message = result.Message,
            data = new
            {
                id = booking.Id,
                userId = booking.UserId,
                departmentId = booking.DepartmentId,
                roomId = booking.RoomId,
                title = booking.Title,
                description = booking.Description,
                startTime = booking.StartTime,
                endTime = booking.EndTime,
                status = booking.Status,
                createdAt = booking.CreatedAt
            }
        });
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier
        );

        if (userIdClaim == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "User identity not found."
            });
        }

        var userId = int.Parse(userIdClaim.Value);

        var result = await _bookingService.CancelBookingAsync(
            id,
            userId
        );

        if (!result.Success)
        {
            return NotFound(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message
        });
    }

    // UPDATE BOOKING STATUS (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateBookingStatusDto request)
    {
        // Validasi status
        if (!Enum.IsDefined(
            typeof(BookingStatus),
            request.Status))
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid booking status."
            });
        }

        var status = (BookingStatus)request.Status;

        var result = await _bookingService
            .UpdateBookingStatusAsync(id, status);

        if (!result.Success)
        {
            return NotFound(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> ApproveBooking(int id)
    {
        var result = await _bookingService
            .ApproveBookingAsync(id);

        if (!result.Success)
        {
            if (result.Message == "Booking not found.")
            {
                return NotFound(new
                {
                    success = false,
                    message = result.Message
                });
            }

            if (result.Message.Contains("already booked"))
            {
                return Conflict(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> RejectBooking(int id)
    {
        var result = await _bookingService
            .RejectBookingAsync(id);

        if (!result.Success)
        {
            if (result.Message == "Booking not found.")
            {
                return NotFound(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message
        });
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("calendar")]
    public async Task<IActionResult> GetCalendar(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var data = await _bookingService
            .GetCalendarAsync(
                startDate,
                endDate
            );

        return Ok(new
        {
            success = true,
            data = data
        });
    }
}