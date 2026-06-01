using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class addpreferdays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreferredDayOff",
                table: "TeachersHistory",
                newName: "PreferredDayOffC");

            migrationBuilder.RenameColumn(
                name: "PreferredDayOff",
                table: "Teachers",
                newName: "PreferredDayOffC");

            migrationBuilder.AddColumn<string>(
                name: "PreferredDayOffA",
                table: "TeachersHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredDayOffB",
                table: "TeachersHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredDayOffA",
                table: "Teachers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredDayOffB",
                table: "Teachers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreferredDayOffA",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "PreferredDayOffB",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "PreferredDayOffA",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "PreferredDayOffB",
                table: "Teachers");

            migrationBuilder.RenameColumn(
                name: "PreferredDayOffC",
                table: "TeachersHistory",
                newName: "PreferredDayOff");

            migrationBuilder.RenameColumn(
                name: "PreferredDayOffC",
                table: "Teachers",
                newName: "PreferredDayOff");
        }
    }
}
