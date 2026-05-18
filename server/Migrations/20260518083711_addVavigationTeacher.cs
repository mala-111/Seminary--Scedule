using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class addVavigationTeacher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TeacherToSubjects_TeacherID",
                table: "TeacherToSubjects",
                column: "TeacherID");

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
                name: "FK_TeacherToSubjects_Teachers_TeacherID",
                table: "TeacherToSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TeacherToSubjects_TeacherID",
                table: "TeacherToSubjects");
        }
    }
}
