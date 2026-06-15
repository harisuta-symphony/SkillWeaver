using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillWeaver.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSkillCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Category column is already present in Skills from InitialCreate
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
