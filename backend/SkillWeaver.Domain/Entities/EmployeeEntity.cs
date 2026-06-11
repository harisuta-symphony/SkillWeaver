namespace SkillWeaver.Domain.Entities;

public class EmployeeEntity
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int CapacityPercentage { get; set; }

    public ICollection<EmployeeSkillEntity> EmployeeSkills { get; set; } = new List<EmployeeSkillEntity>();
}
