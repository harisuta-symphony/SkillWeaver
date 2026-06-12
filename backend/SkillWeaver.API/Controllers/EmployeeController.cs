using Microsoft.AspNetCore.Mvc;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;

namespace SkillWeaver.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService) { _employeeService = employeeService; }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _employeeService.GetAllEmployeesAsync();
        return Ok(employees);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await _employeeService.GetEmployeeByIdAsync(id);
        if (employee is null) return NotFound();
        return Ok(employee);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        var created = await _employeeService.CreateEmployeeAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPatch("{id}/capacity")]
    public async Task<IActionResult> UpdateCapacity(int id, [FromBody] UpdateCapacityDto dto)
    {
        var updated = await _employeeService.UpdateEmployeeCapacityAsync(id, dto.CapacityPercentage);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpPost("{id}/skills")]
    public async Task<IActionResult> AssignSkill(int id, [FromBody] AssignSkillDto dto)
    {
        var success = await _employeeService.AssignSkillAsync(id, dto.SkillId, dto.Proficiency);
        if (!success) return BadRequest("Could not assign skill. Check employee ID, skill ID, and proficiency value.");
        return Ok();
    }
}

public record UpdateCapacityDto(int CapacityPercentage);
public record AssignSkillDto(int SkillId, string Proficiency);
