using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.DTOs;
using RoomBooking.API.Models;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/v1/users
    [HttpPost]
    public async Task<IActionResult> CreateUser(
        [FromBody] CreateUserDto request)
    {
        // Validasi nama
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Name is required."
            });
        }

        // Validasi email
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                success = false,
                message = "Email is required."
            });
        }

        // Validasi password
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Password is required."
            });
        }

        if (request.Password.Length < 6)
        {
            return BadRequest(new
            {
                success = false,
                message = "Password must be at least 6 characters."
            });
        }

        // Cek email sudah digunakan atau belum
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Email is already registered."
            });
        }

        // Cek Department
        var departmentExists = await _context.Departments
            .AnyAsync(d => d.Id == request.DepartmentId);

        if (!departmentExists)
        {
            return NotFound(new
            {
                success = false,
                message = "Department not found."
            });
        }

        // Validasi Role
        if (request.Role != 0 && request.Role != 1)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid role."
            });
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(
            request.Password
        );

        // Buat User
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            DepartmentId = request.DepartmentId,
            Role = (Role)request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            success = true,
            message = "User created successfully.",
            data = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.DepartmentId,
                user.Role,
                user.CreatedAt
            }
        });
    }

    // GET: api/v1/users
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Department)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.DepartmentId,
                Department = u.Department != null
                    ? u.Department.Name
                    : null,
                u.Role,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = users
        });
    }

    // GET: api/v1/users/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Department)
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.DepartmentId,
                Department = u.Department != null
                    ? u.Department.Name
                    : null,
                u.Role,
                u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                success = false,
                message = "User not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = user
        });
    }

    // DELETE: api/v1/users/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users
            .FindAsync(id);

        if (user == null)
        {
            return NotFound(new
            {
                success = false,
                message = "User not found."
            });
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "User deleted successfully."
        });
    }
}