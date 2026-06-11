namespace SkillWeaver.Domain.Entities;

public class ProjectProposalEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequiredCommitmentPercentage { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<ProjectRequiredSkillEntity> RequiredSkills { get; set; } = new List<ProjectRequiredSkillEntity>();
}
