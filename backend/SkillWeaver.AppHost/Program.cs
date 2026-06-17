var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL — Aspire creates a container and injects the connection string automatically.
var postgres = builder.AddPostgres("postgres")
                      .WithDataVolume("skillweaver-postgres-data")
                      .AddDatabase("skillweaverdb");

// .NET API — Aspire starts the project and injects the DB connection string.
var api = builder.AddProject("api", "../SkillWeaver.API/SkillWeaver.API.csproj")
                 .WithReference(postgres)
                 .WaitFor(postgres);

// Angular frontend — served via Node/npm during development.
builder.AddNpmApp("frontend", "../../frontend")
       .WithReference(api)
       .WithHttpEndpoint(port: 4200, env: "PORT")
       .WaitFor(api);

builder.Build().Run();
