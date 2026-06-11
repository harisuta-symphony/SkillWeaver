namespace SkillWeaver.Domain.Entities;

public class SkillEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }

    public ICollection<EmployeeSkillEntity> EmployeeSkills { get; set; } = new List<EmployeeSkillEntity>();
}
