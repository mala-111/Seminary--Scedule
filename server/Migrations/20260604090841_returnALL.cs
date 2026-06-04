using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class returnALL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DaughtersTeachers_AllClasses_AllClassesID",
                table: "DaughtersTeachers");

            migrationBuilder.DropIndex(
                name: "IX_DaughtersTeachers_AllClassesID",
                table: "DaughtersTeachers");

            migrationBuilder.DropColumn(
                name: "AllClassesID",
                table: "DaughtersTeachers");

            migrationBuilder.AddColumn<string>(
                name: "ClassName",
                table: "DaughtersTeachers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassName",
                table: "DaughtersTeachers");

            migrationBuilder.AddColumn<Guid>(
                name: "AllClassesID",
                table: "DaughtersTeachers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_DaughtersTeachers_AllClassesID",
                table: "DaughtersTeachers",
                column: "AllClassesID");

            migrationBuilder.AddForeignKey(
                name: "FK_DaughtersTeachers_AllClasses_AllClassesID",
                table: "DaughtersTeachers",
                column: "AllClassesID",
                principalTable: "AllClasses",
                principalColumn: "AllClassesID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
