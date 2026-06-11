namespace SkillWeaver.Application.services;

using AutoMapper;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public class SkillService : ISkillService
{
    private readonly ISkillRepository _skillRepository;
    private readonly IMapper _mapper;

    public SkillService(ISkillRepository skillRepository, IMapper mapper)
    {
        _skillRepository = skillRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SkillDto>> GetAllSkillsAsync()
    {
        var skills = await _skillRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<SkillDto>>(skills);
    }

    public async Task<SkillDto?> GetSkillByIdAsync(int id)
    {
        var skill = await _skillRepository.GetByIdAsync(id);
        return skill is null ? null : _mapper.Map<SkillDto>(skill);
    }

    public async Task<SkillDto> CreateSkillAsync(SkillDto dto)
    {
        var entity = new SkillEntity
        {
            Name = dto.Name,
            Category = dto.Category
        };

        var created = await _skillRepository.AddAsync(entity);
        return _mapper.Map<SkillDto>(created);
    }
}
