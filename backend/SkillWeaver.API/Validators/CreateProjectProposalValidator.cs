using FluentValidation;
using SkillWeaver.Application.dtos;

namespace SkillWeaver.API.Validators;

public class CreateProjectProposalValidator : AbstractValidator<CreateProjectProposalDto>
{
    public CreateProjectProposalValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.RequiredCommitmentPercentage)
            .InclusiveBetween(1, 100).WithMessage("Commitment percentage must be between 1 and 100.");

        RuleFor(x => x.RequiredSkills)
            .NotEmpty().WithMessage("At least one required skill must be specified.");
    }
}
