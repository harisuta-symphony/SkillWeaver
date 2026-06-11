namespace SkillWeaver.Domain.Entities;

using SkillWeaver.Domain.Enums;

public class ProjectRequiredSkillEntity
{
    public int Id { get; set; }
    public int ProjectProposalId { get; set; }
    public int SkillId { get; set; }
    public ProficiencyLevel MinimumProficiency { get; set; }

    public SkillEntity Skill { get; set; } = null!;
}
