using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class addhoursbookd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HourEnd",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "HourStart",
                table: "TeachersHistory");

            migrationBuilder.CreateTable(
                name: "HoursBooked",
                columns: table => new
                {
                    BookingID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Day = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HourStart = table.Column<TimeSpan>(type: "time", nullable: false),
                    HourEnd = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursBooked", x => x.BookingID);
                });

            migrationBuilder.CreateTable(
                name: "HoursBookedHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Day = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HourStart = table.Column<TimeSpan>(type: "time", nullable: false),
                    HourEnd = table.Column<TimeSpan>(type: "time", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursBookedHistory", x => x.HistoryId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HoursBooked");

            migrationBuilder.DropTable(
                name: "HoursBookedHistory");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HourEnd",
                table: "TeachersHistory",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HourStart",
                table: "TeachersHistory",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
