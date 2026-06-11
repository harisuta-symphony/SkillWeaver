namespace SkillWeaver.Application.dtos;

public class EmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int CapacityPercentage { get; set; }
    public int AvailableCapacity => 100 - CapacityPercentage;
    public List<EmployeeSkillDto> Skills { get; set; } = new();
}

public class EmployeeSkillDto
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string ProficiencyLevel { get; set; } = string.Empty;
}

public class CreateEmployeeDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int CapacityPercentage { get; set; }
}