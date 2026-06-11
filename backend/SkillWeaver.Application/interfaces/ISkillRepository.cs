namespace SkillWeaver.Application.interfaces;

using SkillWeaver.Domain.Entities;

public interface ISkillRepository
{
    Task<IEnumerable<SkillEntity>> GetAllAsync();
    Task<SkillEntity?> GetByIdAsync(int id);
    Task<SkillEntity> AddAsync(SkillEntity entity);
}
