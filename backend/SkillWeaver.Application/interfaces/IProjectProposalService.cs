namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface IProjectProposalService
{
    Task<IEnumerable<ProjectProposalDto>> GetAllProposalsAsync();
    Task<ProjectProposalDto?> GetProposalByIdAsync(int id);
    Task<ProjectProposalDto> CreateProposalAsync(CreateProjectProposalDto dto);
}