using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Models;

namespace RoomBooking.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();

        var department = await context.Departments
            .FirstOrDefaultAsync();

        if (department == null)
        {
            department = new Department
            {
                Name = "General"
            };

            context.Departments.Add(department);

            await context.SaveChangesAsync();
        }

        var adminExists = await context.Users.AnyAsync(u =>
            u.Email == "admin@roombooking.com"
        );

        if (adminExists)
        {
            return;
        }

        var admin = new User
        {
            Name = "Administrator",
            Email = "admin@roombooking.com",
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword("Admin123!"),

            Role = Role.Admin,

            DepartmentId = department.Id,

            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}