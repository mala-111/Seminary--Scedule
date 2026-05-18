using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddAllClassesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Schedule",
                table: "Schedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HoursBookeds",
                table: "HoursBookeds");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AllClassess",
                table: "AllClassess");

            migrationBuilder.RenameTable(
                name: "Schedule",
                newName: "Schedules");

            migrationBuilder.RenameTable(
                name: "HoursBookeds",
                newName: "HoursBooked");

            migrationBuilder.RenameTable(
                name: "AllClassess",
                newName: "AllClasses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Schedules",
                table: "Schedules",
                column: "ScheduleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HoursBooked",
                table: "HoursBooked",
                column: "BookingID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AllClasses",
                table: "AllClasses",
                column: "AllClassesID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Schedules",
                table: "Schedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HoursBooked",
                table: "HoursBooked");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AllClasses",
                table: "AllClasses");

            migrationBuilder.RenameTable(
                name: "Schedules",
                newName: "Schedule");

            migrationBuilder.RenameTable(
                name: "HoursBooked",
                newName: "HoursBookeds");

            migrationBuilder.RenameTable(
                name: "AllClasses",
                newName: "AllClassess");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Schedule",
                table: "Schedule",
                column: "ScheduleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HoursBookeds",
                table: "HoursBookeds",
                column: "BookingID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AllClassess",
                table: "AllClassess",
                column: "AllClassesID");
        }
    }
}
