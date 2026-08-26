namespace RoomBooking.API.DTOs;

public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public int DepartmentId { get; set; }

    public int Role { get; set; } = 0;
}