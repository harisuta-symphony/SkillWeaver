namespace SkillWeaver.Application.services;

using AutoMapper;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Domain.Enums;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public EmployeeService(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
    {
        var employees = await _employeeRepository.GetAllWithSkillsAsync();
        return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
    }

    public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
    {
        var employee = await _employeeRepository.GetByIdWithSkillsAsync(id);
        return employee is null ? null : _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto)
    {
        var entity = new EmployeeEntity
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Department = dto.Department,
            CapacityPercentage = dto.CapacityPercentage
        };

        var created = await _employeeRepository.AddAsync(entity);
        return _mapper.Map<EmployeeDto>(created);
    }

    public async Task<EmployeeDto?> UpdateEmployeeCapacityAsync(int id, int newCapacity)
    {
        var employee = await _employeeRepository.GetByIdWithSkillsAsync(id);
        if (employee is null) return null;

        employee.CapacityPercentage = newCapacity;
        await _employeeRepository.UpdateAsync(employee);
        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<bool> AssignSkillAsync(int employeeId, int skillId, string proficiency)
    {
        if (!Enum.TryParse<ProficiencyLevel>(proficiency, ignoreCase: true, out var level))
            return false;

        return await _employeeRepository.AssignSkillAsync(employeeId, skillId, level);
    }
}
