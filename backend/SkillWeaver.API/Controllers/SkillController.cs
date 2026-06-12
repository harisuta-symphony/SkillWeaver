using Microsoft.AspNetCore.Mvc;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;

namespace SkillWeaver.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillController(ISkillService skillService) { _skillService = skillService; }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var skills = await _skillService.GetAllSkillsAsync();
        return Ok(skills);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var skill = await _skillService.GetSkillByIdAsync(id);
        if (skill is null) return NotFound();
        return Ok(skill);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SkillDto dto)
    {
        var created = await _skillService.CreateSkillAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
