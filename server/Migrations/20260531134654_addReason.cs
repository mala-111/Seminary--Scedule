using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class addReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "HoursBookedHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "HoursBooked",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reason",
                table: "HoursBookedHistory");

            migrationBuilder.DropColumn(
                name: "Reason",
                table: "HoursBooked");
        }
    }
}
