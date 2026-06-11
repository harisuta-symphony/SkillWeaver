namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface ISkillService
{
    Task<IEnumerable<SkillDto>> GetAllSkillsAsync();
    Task<SkillDto?> GetSkillByIdAsync(int id);
    Task<SkillDto> CreateSkillAsync(SkillDto dto);
}