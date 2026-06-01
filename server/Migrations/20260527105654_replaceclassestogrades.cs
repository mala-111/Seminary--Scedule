using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class replaceclassestogrades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Classes_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherToSubjects_Classes_ClassID",
                table: "TeacherToSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassesHistory",
                table: "ClassesHistory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Classes",
                table: "Classes");

            migrationBuilder.RenameTable(
                name: "ClassesHistory",
                newName: "GradesHistory");

            migrationBuilder.RenameTable(
                name: "Classes",
                newName: "Grades");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GradesHistory",
                table: "GradesHistory",
                column: "HistoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Grades",
                table: "Grades",
                column: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Grades_ClassID",
                table: "TeachersHistory",
                column: "ClassID",
                principalTable: "Grades",
                principalColumn: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherToSubjects_Grades_ClassID",
                table: "TeacherToSubjects",
                column: "ClassID",
                principalTable: "Grades",
                principalColumn: "ClassID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Grades_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherToSubjects_Grades_ClassID",
                table: "TeacherToSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GradesHistory",
                table: "GradesHistory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Grades",
                table: "Grades");

            migrationBuilder.RenameTable(
                name: "GradesHistory",
                newName: "ClassesHistory");

            migrationBuilder.RenameTable(
                name: "Grades",
                newName: "Classes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassesHistory",
                table: "ClassesHistory",
                column: "HistoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Classes",
                table: "Classes",
                column: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Classes_ClassID",
                table: "TeachersHistory",
                column: "ClassID",
                principalTable: "Classes",
                principalColumn: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherToSubjects_Classes_ClassID",
                table: "TeacherToSubjects",
                column: "ClassID",
                principalTable: "Classes",
                principalColumn: "ClassID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
