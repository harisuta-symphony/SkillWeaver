namespace SkillWeaver.Domain.Entities;

using SkillWeaver.Domain.Enums;

public class EmployeeSkillEntity
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int SkillId { get; set; }
    public ProficiencyLevel ProficiencyLevel { get; set; }

    public EmployeeEntity Employee { get; set; } = null!;
    public SkillEntity Skill { get; set; } = null!;
}
