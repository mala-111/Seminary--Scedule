using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacherToSubjectFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Schedules");

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
                name: "IX_HoursBooked_TeacherID",
                table: "HoursBooked",
                column: "TeacherID");

            migrationBuilder.AddForeignKey(
                name: "FK_HoursBooked_Teachers_TeacherID",
                table: "HoursBooked",
                column: "TeacherID",
                principalTable: "Teachers",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_AllClasses_AllClassesID",
                table: "Schedules",
                column: "AllClassesID",
                principalTable: "AllClasses",
                principalColumn: "AllClassesID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Subjects_SubjectID",
                table: "Schedules",
                column: "SubjectID",
                principalTable: "Subjects",
                principalColumn: "SubjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Teachers_TeacherID",
                table: "Schedules",
                column: "TeacherID",
                principalTable: "Teachers",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeachersHistory_Classes_ClassID",
                table: "TeachersHistory",
                column: "ClassID",
                principalTable: "Classes",
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

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherToSubjects_Classes_ClassID",
                table: "TeacherToSubjects",
                column: "ClassID",
                principalTable: "Classes",
                principalColumn: "ClassID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherToSubjects_Subjects_SubjectID",
                table: "TeacherToSubjects",
                column: "SubjectID",
                principalTable: "Subjects",
                principalColumn: "SubjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherToSubjects_Teachers_TeacherID",
                table: "TeacherToSubjects",
                column: "TeacherID",
                principalTable: "Teachers",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoursBooked_Teachers_TeacherID",
                table: "HoursBooked");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_AllClasses_AllClassesID",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Subjects_SubjectID",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Teachers_TeacherID",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Classes_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Subjects_SubjectID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachersHistory_Teachers_TeacherID",
                table: "TeachersHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherToSubjects_Classes_ClassID",
                table: "TeacherToSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherToSubjects_Subjects_SubjectID",
                table: "TeacherToSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherToSubjects_Teachers_TeacherID",
                table: "TeacherToSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TeacherToSubjects_ClassID",
                table: "TeacherToSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TeacherToSubjects_SubjectID",
                table: "TeacherToSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TeacherToSubjects_TeacherID",
                table: "TeacherToSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_SubjectID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_TeachersHistory_TeacherID",
                table: "TeachersHistory");

            migrationBuilder.DropIndex(
                name: "IX_Schedules_AllClassesID",
                table: "Schedules");

            migrationBuilder.DropIndex(
                name: "IX_Schedules_SubjectID",
                table: "Schedules");

            migrationBuilder.DropIndex(
                name: "IX_Schedules_TeacherID",
                table: "Schedules");

            migrationBuilder.DropIndex(
                name: "IX_HoursBooked_TeacherID",
                table: "HoursBooked");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "TeachersHistory");

            migrationBuilder.DropColumn(
                name: "SubjectID",
                table: "TeachersHistory");

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Schedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
