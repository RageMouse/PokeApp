using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamAPI.Migrations
{
    /// <inheritdoc />
    public partial class Capitalize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isCreated",
                table: "Team",
                newName: "IsCreated");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsCreated",
                table: "Team",
                newName: "isCreated");
        }
    }
}
