using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using SkillWeaver.Application.interfaces;
using SkillWeaver.Application.services;
using SkillWeaver.Infrastructure.Data;
using SkillWeaver.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<SkillWeaverDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<ISkillRepository, SkillRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IProjectProposalRepository, ProjectProposalRepository>();

// Application services
builder.Services.AddScoped<ISkillService, SkillService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IProjectProposalService, ProjectProposalService>();
builder.Services.AddScoped<ITeamAssemblyService, TeamAssemblyService>();

// CORS for Angular dev server
builder.Services.AddCors(options =>
    options.AddPolicy("AngularDev", policy =>
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!)
              .AllowAnyMethod()
              .AllowAnyHeader()));

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<SkillWeaverDbContext>();
    await DatabaseSeeder.SeedAsync(db);
}

app.UseHttpsRedirection();
app.UseCors("AngularDev");
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

app.Run();
