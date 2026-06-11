namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public interface IEmployeeRepository
{
    Task<IEnumerable<EmployeeEntity>> GetAllWithSkillsAsync();
    Task<EmployeeEntity?> GetByIdWithSkillsAsync(int id);
    Task<EmployeeEntity> AddAsync(EmployeeEntity entity);
    Task UpdateAsync(EmployeeEntity entity);
    Task<bool> AssignSkillAsync(int employeeId, int skillId, Domain.Enums.ProficiencyLevel level);
}