# ── Stage 1: Build ──────────────────────────────────────────────────────────
# The full .NET SDK image has the compiler, NuGet, and dotnet-ef.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first — Docker caches each layer.
# If only .cs files change (not .csproj), NuGet restore is skipped on rebuild.
COPY SkillWeaver.slnx .
COPY SkillWeaver.API/SkillWeaver.API.csproj                           SkillWeaver.API/
COPY SkillWeaver.Application/SkillWeaver.Application.csproj           SkillWeaver.Application/
COPY SkillWeaver.Domain/SkillWeaver.Domain.csproj                     SkillWeaver.Domain/
COPY SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj     SkillWeaver.Infrastructure/

RUN dotnet restore SkillWeaver.slnx

# Copy remaining source and publish a Release build.
COPY . .
RUN dotnet publish SkillWeaver.API/SkillWeaver.API.csproj \
    -c Release -o /app/publish --no-restore

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
# The aspnet image is ~100 MB vs ~600 MB for the SDK image.
# It contains only the ASP.NET runtime — no compiler, no NuGet.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# ASP.NET Core uses port 8080 by default inside containers.
EXPOSE 8080

ENTRYPOINT ["dotnet", "SkillWeaver.API.dll"]