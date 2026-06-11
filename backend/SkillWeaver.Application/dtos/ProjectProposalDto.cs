namespace SkillWeaver.Application.dtos;

public class ProjectProposalDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequiredCommitmentPercentage { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<RequiredSkillDto> RequiredSkills { get; set; } = new();
}

public class RequiredSkillDto
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string MinimumProficiency { get; set; } = string.Empty;
}

public class CreateProjectProposalDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequiredCommitmentPercentage { get; set; }
    public List<CreateRequiredSkillDto> RequiredSkills { get; set; } = new();
}

public class CreateRequiredSkillDto
{
    public int SkillId { get; set; }
    public string MinimumProficiency { get; set; } = string.Empty;
}