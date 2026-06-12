using Microsoft.AspNetCore.Mvc;
using SkillWeaver.Application.dtos;
using SkillWeaver.Application.interfaces;

namespace SkillWeaver.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectProposalController : ControllerBase
{
    private readonly IProjectProposalService _proposalService;
    private readonly ITeamAssemblyService _teamAssemblyService;

    public ProjectProposalController(IProjectProposalService proposalService, ITeamAssemblyService teamAssemblyService)
    {
        _proposalService = proposalService;
        _teamAssemblyService = teamAssemblyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var proposals = await _proposalService.GetAllProposalsAsync();
        return Ok(proposals);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var proposal = await _proposalService.GetProposalByIdAsync(id);
        if (proposal is null) return NotFound();
        return Ok(proposal);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectProposalDto dto)
    {
        var created = await _proposalService.CreateProposalAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id}/assemble-team")]
    public async Task<IActionResult> AssembleTeam(int id)
    {
        try
        {
            var result = await _teamAssemblyService.AssembleTeamAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
