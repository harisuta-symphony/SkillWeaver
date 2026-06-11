using Microsoft.EntityFrameworkCore;
using SkillWeaver.Domain.Entities;

namespace SkillWeaver.Infrastructure.Data;

public class SkillWeaverDbContext : DbContext
{
    public SkillWeaverDbContext(DbContextOptions<SkillWeaverDbContext> options) : base(options) { }

    public DbSet<EmployeeEntity> Employees => Set<EmployeeEntity>();
    public DbSet<SkillEntity> Skills => Set<SkillEntity>();
    public DbSet<EmployeeSkillEntity> EmployeeSkills => Set<EmployeeSkillEntity>();
    public DbSet<ProjectProposalEntity> ProjectProposals => Set<ProjectProposalEntity>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Unique email constraint
        builder.Entity<EmployeeEntity>().HasIndex(e => e.Email).IsUnique();

        // Unique skill name
        builder.Entity<SkillEntity>().HasIndex(s => s.Name).IsUnique();

        // EmployeeSkill composite unique constraint
        builder.Entity<EmployeeSkillEntity>()
            .HasIndex(es => new { es.EmployeeId, es.SkillId })
            .IsUnique();

        // Store enum as string for readability
        builder.Entity<EmployeeSkillEntity>()
            .Property(es => es.ProficiencyLevel)
            .HasConversion<string>();

        builder.Entity<ProjectProposalEntity>()
            .Property(p => p.CreatedAt)
            .HasDefaultValueSql("NOW()");
    }
}