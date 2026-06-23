using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AllClasses",
                columns: table => new
                {
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllClasses", x => x.AllClassesID);
                });

            migrationBuilder.CreateTable(
                name: "AllClassesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassName = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllClassesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "DaughtersTeachersHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassDaughtersTeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassName = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaughtersTeachersHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    EmployeeCode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "EmployeesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    EmployeeCode = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "Grades",
                columns: table => new
                {
                    ClassID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grades", x => x.ClassID);
                });

            migrationBuilder.CreateTable(
                name: "GradesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GradesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "HoursBookedHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingID = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    Day = table.Column<string>(type: "text", nullable: false),
                    HourStart = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HourEnd = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursBookedHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "SchedulesHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    Day = table.Column<int>(type: "integer", nullable: false),
                    Hour = table.Column<int>(type: "integer", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulesHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "SchoolSettings",
                columns: table => new
                {
                    SchoolSettingsId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartHour = table.Column<int>(type: "integer", nullable: false),
                    EndHour = table.Column<int>(type: "integer", nullable: false),
                    WorkingDaysPerWeek = table.Column<int>(type: "integer", nullable: false),
                    MinLessonsPerDay = table.Column<int>(type: "integer", nullable: false),
                    MaxConsecutiveLessons = table.Column<int>(type: "integer", nullable: false),
                    PatrolHoursRatio = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolSettings", x => x.SchoolSettingsId);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.SubjectID);
                });

            migrationBuilder.CreateTable(
                name: "SubjectsHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectsHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "Teachers",
                columns: table => new
                {
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeCode = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    WeeklyHours = table.Column<int>(type: "integer", nullable: false),
                    IsClassTeacher = table.Column<bool>(type: "boolean", nullable: false),
                    IsGroupingTeacher = table.Column<bool>(type: "boolean", nullable: false),
                    ClassName = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffA = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffB = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffC = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teachers", x => x.TeacherID);
                });

            migrationBuilder.CreateTable(
                name: "TeachersHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeCode = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    WeeklyHours = table.Column<int>(type: "integer", nullable: false),
                    ClassName = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffA = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffB = table.Column<string>(type: "text", nullable: false),
                    PreferredDayOffC = table.Column<string>(type: "text", nullable: false),
                    IsClassTeacher = table.Column<bool>(type: "boolean", nullable: false),
                    IsGroupingTeacher = table.Column<bool>(type: "boolean", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeachersHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "TeacherToSubjectsHistory",
                columns: table => new
                {
                    HistoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherToSubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassID = table.Column<Guid>(type: "uuid", nullable: false),
                    UpdateHistory = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherToSubjectsHistory", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "DaughtersTeachers",
                columns: table => new
                {
                    ClassDaughtersTeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaughtersTeachers", x => x.ClassDaughtersTeacherID);
                    table.ForeignKey(
                        name: "FK_DaughtersTeachers_AllClasses_AllClassesID",
                        column: x => x.AllClassesID,
                        principalTable: "AllClasses",
                        principalColumn: "AllClassesID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassSubjectRequirements",
                columns: table => new
                {
                    ClassSubjectRequirementId = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    WeeklyHoursRequired = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassSubjectRequirements", x => x.ClassSubjectRequirementId);
                    table.ForeignKey(
                        name: "FK_ClassSubjectRequirements_AllClasses_AllClassesID",
                        column: x => x.AllClassesID,
                        principalTable: "AllClasses",
                        principalColumn: "AllClassesID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassSubjectRequirements_Subjects_SubjectID",
                        column: x => x.SubjectID,
                        principalTable: "Subjects",
                        principalColumn: "SubjectID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HoursBooked",
                columns: table => new
                {
                    BookingID = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    Day = table.Column<string>(type: "text", nullable: false),
                    HourStart = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HourEnd = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursBooked", x => x.BookingID);
                    table.ForeignKey(
                        name: "FK_HoursBooked_Teachers_TeacherID",
                        column: x => x.TeacherID,
                        principalTable: "Teachers",
                        principalColumn: "TeacherID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    ScheduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    AllClassesID = table.Column<Guid>(type: "uuid", nullable: false),
                    Day = table.Column<int>(type: "integer", nullable: false),
                    Hour = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.ScheduleId);
                    table.ForeignKey(
                        name: "FK_Schedules_AllClasses_AllClassesID",
                        column: x => x.AllClassesID,
                        principalTable: "AllClasses",
                        principalColumn: "AllClassesID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedules_Subjects_SubjectID",
                        column: x => x.SubjectID,
                        principalTable: "Subjects",
                        principalColumn: "SubjectID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedules_Teachers_TeacherID",
                        column: x => x.TeacherID,
                        principalTable: "Teachers",
                        principalColumn: "TeacherID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeacherToSubjects",
                columns: table => new
                {
                    TeacherToSubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherToSubjects", x => x.TeacherToSubjectId);
                    table.ForeignKey(
                        name: "FK_TeacherToSubjects_Grades_ClassID",
                        column: x => x.ClassID,
                        principalTable: "Grades",
                        principalColumn: "ClassID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherToSubjects_Subjects_SubjectID",
                        column: x => x.SubjectID,
                        principalTable: "Subjects",
                        principalColumn: "SubjectID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherToSubjects_Teachers_TeacherID",
                        column: x => x.TeacherID,
                        principalTable: "Teachers",
                        principalColumn: "TeacherID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassSubjectRequirements_AllClassesID",
                table: "ClassSubjectRequirements",
                column: "AllClassesID");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSubjectRequirements_SubjectID",
                table: "ClassSubjectRequirements",
                column: "SubjectID");

            migrationBuilder.CreateIndex(
                name: "IX_DaughtersTeachers_AllClassesID",
                table: "DaughtersTeachers",
                column: "AllClassesID");

            migrationBuilder.CreateIndex(
                name: "IX_HoursBooked_TeacherID",
                table: "HoursBooked",
                column: "TeacherID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_AllClassesID",
                table: "Schedules",
                column: "AllClassesID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_SubjectID",
                table: "Schedules",
                column: "SubjectID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_TeacherID",
                table: "Schedules",
                column: "TeacherID");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherToSubjects_ClassID",
                table: "TeacherToSubjects",
                column: "ClassID");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherToSubjects_SubjectID",
                table: "TeacherToSubjects",
                column: "SubjectID");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherToSubjects_TeacherID",
                table: "TeacherToSubjects",
                column: "TeacherID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AllClassesHistory");

            migrationBuilder.DropTable(
                name: "ClassSubjectRequirements");

            migrationBuilder.DropTable(
                name: "DaughtersTeachers");

            migrationBuilder.DropTable(
                name: "DaughtersTeachersHistory");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "EmployeesHistory");

            migrationBuilder.DropTable(
                name: "GradesHistory");

            migrationBuilder.DropTable(
                name: "HoursBooked");

            migrationBuilder.DropTable(
                name: "HoursBookedHistory");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "SchedulesHistory");

            migrationBuilder.DropTable(
                name: "SchoolSettings");

            migrationBuilder.DropTable(
                name: "SubjectsHistory");

            migrationBuilder.DropTable(
                name: "TeachersHistory");

            migrationBuilder.DropTable(
                name: "TeacherToSubjects");

            migrationBuilder.DropTable(
                name: "TeacherToSubjectsHistory");

            migrationBuilder.DropTable(
                name: "AllClasses");

            migrationBuilder.DropTable(
                name: "Grades");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Teachers");
        }
    }
}
