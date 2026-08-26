using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/v1/rooms")]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RoomsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateRoom(
        [FromBody] Room room)
    {
        if (string.IsNullOrWhiteSpace(room.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Room name is required."
            });
        }

        if (room.Capacity <= 0)
        {
            return BadRequest(new
            {
                success = false,
                message = "Room capacity must be greater than 0."
            });
        }

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            success = true,
            message = "Room created successfully.",
            data = room
        });
    }

    // GET
    [Authorize(Roles = "Admin, User")]
    [HttpGet]
    public async Task<IActionResult> GetRooms()
    {
        var rooms = await _context.Rooms
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = rooms
        });
    }

    // PUT
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRoom(
        int id,
        [FromBody] Room request)
    {
        var room = await _context.Rooms
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Room not found."
            });
        }

        room.Name = request.Name;
        room.Capacity = request.Capacity;
        room.Facilities = request.Facilities;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Room updated successfully.",
            data = new
            {
                room.Id,
                room.Name,
                room.Capacity,
                room.Facilities
            }
        });
    }

    // DELETE
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var room = await _context.Rooms
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Room not found."
            });
        }

        _context.Rooms.Remove(room);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Room deleted successfully."
        });
    }
    
}