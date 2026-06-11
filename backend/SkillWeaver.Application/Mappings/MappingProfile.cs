namespace SkillWeaver.Application.Mappings;

using AutoMapper;
using SkillWeaver.Application.dtos;
using SkillWeaver.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SkillEntity, SkillDto>();

        CreateMap<EmployeeSkillEntity, EmployeeSkillDto>()
            .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src => src.Skill.Name))
            .ForMember(dest => dest.ProficiencyLevel, opt => opt.MapFrom(src => src.ProficiencyLevel.ToString()));

        CreateMap<EmployeeEntity, EmployeeDto>()
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.EmployeeSkills));

        CreateMap<ProjectRequiredSkillEntity, RequiredSkillDto>()
            .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src => src.Skill.Name))
            .ForMember(dest => dest.MinimumProficiency, opt => opt.MapFrom(src => src.MinimumProficiency.ToString()));

        CreateMap<ProjectProposalEntity, ProjectProposalDto>()
            .ForMember(dest => dest.RequiredSkills, opt => opt.MapFrom(src => src.RequiredSkills));
    }
}
