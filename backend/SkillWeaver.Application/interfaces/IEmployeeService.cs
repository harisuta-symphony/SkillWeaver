namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateEmployeeCapacityAsync(int id, int newCapacity);
    Task<bool> AssignSkillAsync(int employeeId, int skillId, string proficiency);
}