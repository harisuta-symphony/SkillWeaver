namespace SkillWeaver.Application.services;

using AutoMapper;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Domain.Enums;

public class ProjectProposalService : IProjectProposalService
{
    private readonly IProjectProposalRepository _proposalRepository;
    private readonly IMapper _mapper;

    public ProjectProposalService(IProjectProposalRepository proposalRepository, IMapper mapper)
    {
        _proposalRepository = proposalRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProjectProposalDto>> GetAllProposalsAsync()
    {
        var proposals = await _proposalRepository.GetAllWithSkillsAsync();
        return _mapper.Map<IEnumerable<ProjectProposalDto>>(proposals);
    }

    public async Task<ProjectProposalDto?> GetProposalByIdAsync(int id)
    {
        var proposal = await _proposalRepository.GetByIdWithSkillsAsync(id);
        return proposal is null ? null : _mapper.Map<ProjectProposalDto>(proposal);
    }

    public async Task<ProjectProposalDto> CreateProposalAsync(CreateProjectProposalDto dto)
    {
        var entity = new ProjectProposalEntity
        {
            Title = dto.Title,
            Description = dto.Description,
            RequiredCommitmentPercentage = dto.RequiredCommitmentPercentage,
            CreatedAt = DateTime.UtcNow,
            RequiredSkills = dto.RequiredSkills.Select(rs => new ProjectRequiredSkillEntity
            {
                SkillId = rs.SkillId,
                MinimumProficiency = Enum.Parse<ProficiencyLevel>(rs.MinimumProficiency, ignoreCase: true)
            }).ToList()
        };

        var created = await _proposalRepository.AddAsync(entity);
        return _mapper.Map<ProjectProposalDto>(created);
    }
}
