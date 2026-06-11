namespace SkillWeaver.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Infrastructure.Data;

public class SkillRepository : ISkillRepository
{
    private readonly SkillWeaverDbContext _context;

    public SkillRepository(SkillWeaverDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SkillEntity>> GetAllAsync()
    {
        return await _context.Skills.ToListAsync();
    }

    public async Task<SkillEntity?> GetByIdAsync(int id)
    {
        return await _context.Skills.FindAsync(id);
    }

    public async Task<SkillEntity> AddAsync(SkillEntity entity)
    {
        await _context.Skills.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
