using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApiProject.Migrations
{
    /// <inheritdoc />
    public partial class updategood : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HourEnd",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "HourStart",
                table: "Teachers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "HourEnd",
                table: "Teachers",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HourStart",
                table: "Teachers",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
