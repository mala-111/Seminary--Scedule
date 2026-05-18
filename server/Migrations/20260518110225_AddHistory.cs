using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "hour",
                table: "Schedules",
                newName: "Hour");

            migrationBuilder.RenameColumn(
                name: "day",
                table: "Schedules",
                newName: "Day");

            migrationBuilder.AddColumn<string>(
                name: "SubjectDTOay",
                table: "Schedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AllClassesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllClassesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "ClassesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassesHistory", x => x.HistoryId);
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

            migrationBuilder.CreateTable(
                name: "SchedulesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScheduleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Day = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hour = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "SubjectsHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectsHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "TeachersHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WeeklyHours = table.Column<int>(type: "int", nullable: false),
                    PreferredDayOff = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsClassTeacher = table.Column<bool>(type: "bit", nullable: false),
                    IsGroupingTeacher = table.Column<bool>(type: "bit", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeachersHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "TeacherToSubjectsHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherToSubjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherToSubjectsHistory", x => x.HistoryId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AllClassesHistory");

            migrationBuilder.DropTable(
                name: "ClassesHistory");

            migrationBuilder.DropTable(
                name: "HoursBookedHistory");

            migrationBuilder.DropTable(
                name: "SchedulesHistory");

            migrationBuilder.DropTable(
                name: "SubjectsHistory");

            migrationBuilder.DropTable(
                name: "TeachersHistory");

            migrationBuilder.DropTable(
                name: "TeacherToSubjectsHistory");

            migrationBuilder.DropColumn(
                name: "SubjectDTOay",
                table: "Schedules");

            migrationBuilder.RenameColumn(
                name: "Hour",
                table: "Schedules",
                newName: "hour");

            migrationBuilder.RenameColumn(
                name: "Day",
                table: "Schedules",
                newName: "day");
        }
    }
}
