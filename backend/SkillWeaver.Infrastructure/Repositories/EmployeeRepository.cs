namespace SkillWeaver.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Domain.Enums;
using SkillWeaver.Infrastructure.Data;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly SkillWeaverDbContext _context;

    public EmployeeRepository(SkillWeaverDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EmployeeEntity>> GetAllWithSkillsAsync()
    {
        return await _context.Employees
            .Include(e => e.EmployeeSkills)
            .ThenInclude(es => es.Skill)
            .ToListAsync();
    }

    public async Task<EmployeeEntity?> GetByIdWithSkillsAsync(int id)
    {
        return await _context.Employees
            .Include(e => e.EmployeeSkills)
            .ThenInclude(es => es.Skill)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<EmployeeEntity> AddAsync(EmployeeEntity entity)
    {
        await _context.Employees.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(EmployeeEntity entity)
    {
        _context.Employees.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AssignSkillAsync(int employeeId, int skillId, ProficiencyLevel level)
    {
        var existing = await _context.EmployeeSkills
            .FirstOrDefaultAsync(es => es.EmployeeId == employeeId && es.SkillId == skillId);

        if (existing is not null)
        {
            existing.ProficiencyLevel = level;
        }
        else
        {
            await _context.EmployeeSkills.AddAsync(new EmployeeSkillEntity
            {
                EmployeeId = employeeId,
                SkillId = skillId,
                ProficiencyLevel = level
            });
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
