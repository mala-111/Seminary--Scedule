using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    public partial class columtotheachertable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // הוספת עמודה לטבלת Teachers
            migrationBuilder.AddColumn<string>(
                name: "ClassName",
                table: "Teachers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            // הסרת קשרים מ-TeachersHistory
            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Grades_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Subjects_SubjectID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Teachers_TeacherID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_SubjectID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_TeacherID",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "SubjectID",
                table: "TeachersHistory");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // החזרת העמודות ל-TeachersHistory
            migrationBuilder.AddColumn<Guid>(
                name: "ClassID",
                table: "TeachersHistory",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectID",
                table: "TeachersHistory",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeachersHistory_ClassID",
                table: "TeachersHistory",
                column: "ClassID");

            migrationBuilder.CreateIndex(
                name: "IX_TeachersHistory_SubjectID",
                table: "TeachersHistory",
                column: "SubjectID");

            migrationBuilder.CreateIndex(
                name: "IX_TeachersHistory_TeacherID",
                table: "TeachersHistory",
                column: "TeacherID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Grades_ClassID",
                table: "TeachersHistory",
                column: "ClassID",
                principalTable: "Grades",
                principalColumn: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Subjects_SubjectID",
                table: "TeachersHistory",
                column: "SubjectID",
                principalTable: "Subjects",
                principalColumn: "SubjectID");

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Teachers_TeacherID",
                table: "TeachersHistory",
                column: "TeacherID",
                principalTable: "Teachers",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}