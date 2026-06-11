namespace SkillWeaver.Application.services;

using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;

public class TeamAssemblyService : ITeamAssemblyService
{
    private readonly IProjectProposalRepository _proposalRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public TeamAssemblyService(IProjectProposalRepository proposalRepository, IEmployeeRepository employeeRepository)
    {
        _proposalRepository = proposalRepository;
        _employeeRepository = employeeRepository;
    }

    public async Task<SuggestedTeamDto> AssembleTeamAsync(int projectProposalId)
    {
        var proposal = await _proposalRepository.GetByIdWithSkillsAsync(projectProposalId)
            ?? throw new KeyNotFoundException($"Project proposal {projectProposalId} not found.");

        var allEmployees = await _employeeRepository.GetAllWithSkillsAsync();

        var candidates = allEmployees
            .Where(employee =>
                // Employee must satisfy ALL required skills at the minimum proficiency
                proposal.RequiredSkills.All(required =>
                    employee.EmployeeSkills.Any(empSkill =>
                        empSkill.SkillId == required.SkillId &&
                        empSkill.ProficiencyLevel >= required.MinimumProficiency
                    )
                )
            )
            .Where(employee =>
                // Employee must have enough free capacity for the project
                (100 - employee.CapacityPercentage) >= proposal.RequiredCommitmentPercentage
            )
            .ToList();

        return new SuggestedTeamDto
        {
            ProjectProposalId = proposal.Id,
            ProjectTitle = proposal.Title,
            TotalCandidates = candidates.Count,
            SuggestedMembers = candidates.Select(employee => new TeamMemberDto
            {
                EmployeeId = employee.Id,
                FullName = $"{employee.FirstName} {employee.LastName}",
                Email = employee.Email,
                Department = employee.Department,
                AvailableCapacity = 100 - employee.CapacityPercentage,
                MatchedSkills = employee.EmployeeSkills
                    .Where(es => proposal.RequiredSkills.Any(rs => rs.SkillId == es.SkillId))
                    .Select(es => new EmployeeSkillDto
                    {
                        SkillId = es.SkillId,
                        SkillName = es.Skill?.Name ?? string.Empty,
                        ProficiencyLevel = es.ProficiencyLevel.ToString()
                    })
                    .ToList()
            }).ToList()
        };
    }
}
