using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RoomBooking.API.Data;
using RoomBooking.API.DTOs;
using RoomBooking.API.Models;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST: api/v1/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                success = false,
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Password is required."
            });
        }

        // Cari user berdasarkan email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        // Verifikasi password
        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        // Generate JWT
        var token = GenerateJwtToken(user);

        return Ok(new
        {
            success = true,
            message = "Login successful.",
            token = token,
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role.ToString()
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                success = false,
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Password is required."
            });
        }

        // Cek email
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Email is already registered."
            });
        }

        // Validasi role
        if (!Enum.TryParse<Role>(
            request.Role,
            true,
            out var role))
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid role."
            });
        }

        // Buat user
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password
                ),

            Role = role
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            success = true,
            message = "User registered successfully.",
            data = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role.ToString()
            }
        });
    }

    private string GenerateJwtToken(
        RoomBooking.API.Models.User user)
    {
        var jwtKey = _configuration["Jwt:Key"];

        var issuer = _configuration["Jwt:Issuer"];

        var audience = _configuration["Jwt:Audience"];

        var expirationMinutes =
            int.Parse(
                _configuration["Jwt:ExpirationMinutes"]
                ?? "60"
            );

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT Key is not configured."
            );
        }

        var claims = new List<Claim>
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Name
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role.ToString()
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                expirationMinutes
            ),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}