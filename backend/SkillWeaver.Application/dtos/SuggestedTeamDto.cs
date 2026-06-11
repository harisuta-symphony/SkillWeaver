namespace SkillWeaver.Application.dtos;

public class SuggestedTeamDto
{
    public int ProjectProposalId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public List<TeamMemberDto> SuggestedMembers { get; set; } = new();
    public int TotalCandidates { get; set; }
}

public class TeamMemberDto
{
    public int EmployeeId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int AvailableCapacity { get; set; }
    public List<EmployeeSkillDto> MatchedSkills { get; set; } = new();
}