namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface ITeamAssemblyService
{
    /// <summary>
    /// Core algorithm: given a Project Proposal ID, find all employees who
    /// satisfy every required skill at the minimum proficiency AND have
    /// sufficient available capacity.
    /// </summary>
    Task<SuggestedTeamDto> AssembleTeamAsync(int projectProposalId);
}