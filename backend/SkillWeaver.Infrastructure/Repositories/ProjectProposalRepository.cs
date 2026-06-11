namespace SkillWeaver.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Infrastructure.Data;

public class ProjectProposalRepository : IProjectProposalRepository
{
    private readonly SkillWeaverDbContext _context;

    public ProjectProposalRepository(SkillWeaverDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectProposalEntity>> GetAllWithSkillsAsync()
    {
        return await _context.ProjectProposals
            .Include(p => p.RequiredSkills)
            .ThenInclude(rs => rs.Skill)
            .ToListAsync();
    }

    public async Task<ProjectProposalEntity?> GetByIdWithSkillsAsync(int id)
    {
        return await _context.ProjectProposals
            .Include(p => p.RequiredSkills)
            .ThenInclude(rs => rs.Skill)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<ProjectProposalEntity> AddAsync(ProjectProposalEntity entity)
    {
        await _context.ProjectProposals.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
