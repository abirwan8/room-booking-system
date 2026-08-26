using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.Models;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/v1/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DepartmentsController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new
            {
                id = d.Id,
                name = d.Name,
                createdAt = d.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = departments
        });
    }


    [HttpGet("{id:int}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetDepartment(int id)
    {
        var department = await _context.Departments
            .Where(d => d.Id == id)
            .Select(d => new
            {
                id = d.Id,
                name = d.Name,
                createdAt = d.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Department not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = department
        });
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDepartment(
        [FromBody] Department department)
    {
        if (department == null)
        {
            return BadRequest(new
            {
                success = false,
                message = "Department data is required."
            });
        }

        if (string.IsNullOrWhiteSpace(department.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Department name is required."
            });
        }

        var name = department.Name.Trim();

        // Cek department dengan nama yang sama
        var existingDepartment = await _context.Departments
            .FirstOrDefaultAsync(d =>
                d.Name.ToLower() == name.ToLower());

        if (existingDepartment != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Department with this name already exists."
            });
        }

        var newDepartment = new Department
        {
            Name = name,
            CreatedAt = DateTime.UtcNow
        };

        _context.Departments.Add(newDepartment);

        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            success = true,
            message = "Department created successfully.",
            data = new
            {
                id = newDepartment.Id,
                name = newDepartment.Name,
                createdAt = newDepartment.CreatedAt
            }
        });
    }


    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateDepartment(
        int id,
        [FromBody] Department department)
    {
        if (department == null)
        {
            return BadRequest(new
            {
                success = false,
                message = "Department data is required."
            });
        }

        if (string.IsNullOrWhiteSpace(department.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Department name is required."
            });
        }

        var existingDepartment = await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == id);

        if (existingDepartment == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Department not found."
            });
        }

        var name = department.Name.Trim();

        var duplicateDepartment = await _context.Departments
            .FirstOrDefaultAsync(d =>
                d.Id != id &&
                d.Name.ToLower() == name.ToLower());

        if (duplicateDepartment != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Another department with this name already exists."
            });
        }

        existingDepartment.Name = name;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Department updated successfully.",
            data = new
            {
                id = existingDepartment.Id,
                name = existingDepartment.Name,
                createdAt = existingDepartment.CreatedAt
            }
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Department not found."
            });
        }

        var hasUsers = await _context.Users
            .AnyAsync(u => u.DepartmentId == id);

        if (hasUsers)
        {
            return Conflict(new
            {
                success = false,
                message =
                    "This department cannot be deleted because it is still assigned to one or more users."
            });
        }

        _context.Departments.Remove(department);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Department deleted successfully."
        });
    }
}