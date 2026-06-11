using Microsoft.EntityFrameworkCore;
using SkillWeaver.Domain.Entities;
using SkillWeaver.Domain.Enums;

namespace SkillWeaver.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(SkillWeaverDbContext context)
    {
        if (await context.Skills.AnyAsync())
            return;

        var angular = new SkillEntity { Name = "Angular", Category = "Frontend" };
        var dotnet = new SkillEntity { Name = ".NET", Category = "Backend" };
        var postgresql = new SkillEntity { Name = "PostgreSQL", Category = "Database" };
        var systemDesign = new SkillEntity { Name = "System Design", Category = "Architecture" };
        var react = new SkillEntity { Name = "React", Category = "Frontend" };
        var docker = new SkillEntity { Name = "Docker", Category = "DevOps" };

        context.Skills.AddRange(angular, dotnet, postgresql, systemDesign, react, docker);
        await context.SaveChangesAsync();

        var employees = new[]
        {
            new EmployeeEntity
            {
                FirstName = "Alice",
                LastName = "Chen",
                Email = "alice.chen@skillweaver.dev",
                Department = "Engineering",
                CapacityPercentage = 20, // 80% available
                EmployeeSkills = new List<EmployeeSkillEntity>
                {
                    new() { SkillId = angular.Id, ProficiencyLevel = ProficiencyLevel.Expert },
                    new() { SkillId = dotnet.Id, ProficiencyLevel = ProficiencyLevel.Intermediate },
                }
            },
            new EmployeeEntity
            {
                FirstName = "Bruno",
                LastName = "Martins",
                Email = "bruno.martins@skillweaver.dev",
                Department = "Engineering",
                CapacityPercentage = 60, // 40% available
                EmployeeSkills = new List<EmployeeSkillEntity>
                {
                    new() { SkillId = dotnet.Id, ProficiencyLevel = ProficiencyLevel.Expert },
                    new() { SkillId = postgresql.Id, ProficiencyLevel = ProficiencyLevel.Expert },
                    new() { SkillId = docker.Id, ProficiencyLevel = ProficiencyLevel.Intermediate },
                }
            },
            new EmployeeEntity
            {
                FirstName = "Clara",
                LastName = "Nkosi",
                Email = "clara.nkosi@skillweaver.dev",
                Department = "Architecture",
                CapacityPercentage = 0, // 100% available
                EmployeeSkills = new List<EmployeeSkillEntity>
                {
                    new() { SkillId = systemDesign.Id, ProficiencyLevel = ProficiencyLevel.Expert },
                    new() { SkillId = dotnet.Id, ProficiencyLevel = ProficiencyLevel.Intermediate },
                    new() { SkillId = postgresql.Id, ProficiencyLevel = ProficiencyLevel.Intermediate },
                }
            },
            new EmployeeEntity
            {
                FirstName = "David",
                LastName = "Park",
                Email = "david.park@skillweaver.dev",
                Department = "Frontend",
                CapacityPercentage = 80, // 20% available — intentionally limited
                EmployeeSkills = new List<EmployeeSkillEntity>
                {
                    new() { SkillId = react.Id, ProficiencyLevel = ProficiencyLevel.Expert },
                    new() { SkillId = angular.Id, ProficiencyLevel = ProficiencyLevel.Beginner },
                }
            },
        };

        context.Employees.AddRange(employees);
        await context.SaveChangesAsync();
    }
}
