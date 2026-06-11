namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public interface IProjectProposalRepository
{
    Task<IEnumerable<ProjectProposalEntity>> GetAllWithSkillsAsync();
    Task<ProjectProposalEntity?> GetByIdWithSkillsAsync(int id);
    Task<ProjectProposalEntity> AddAsync(ProjectProposalEntity entity);
}