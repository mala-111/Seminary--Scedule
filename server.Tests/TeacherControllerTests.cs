using Xunit;
using MyWebApiProject.Controllers;
using MyWebApiProject.Data;
using MyWebApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

public class TeacherControllerTests
{
    [Fact]
    public async Task GetTeacher_ReturnsTeacher_WhenTeacherExists()
    {
        // Arrange
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var teacher = new Teacher
        {
            TeacherID = Guid.NewGuid(),
            Name = "Sara",
            EmployeeCode = "1234",
            WeeklyHours = 20,
            IsClassTeacher = true,
            IsGroupingTeacher = false,
            ClassName = "ז1",
            PreferredDayOffA = "Sunday",
            PreferredDayOffB = "Monday",
            PreferredDayOffC = "Tuesday"
        };

        context.Teachers.Add(teacher);
        await context.SaveChangesAsync();

        var controller = new TeacherController(context);

        // Act
        var result = await controller.GetTeacher(teacher.TeacherID);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Teacher>>(result);

        var returnedTeacher = Assert.IsType<Teacher>(actionResult.Value);

        Assert.Equal("Sara", returnedTeacher.Name);
    }

    [Fact]
public async Task GetTeacher_ReturnsNotFound_WhenTeacherDoesNotExist()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var controller = new TeacherController(context);

    var result = await controller.GetTeacher(Guid.NewGuid());

    Assert.IsType<NotFoundResult>(result.Result);
}

[Fact]
public async Task CreateTeacher_ShouldAddTeacher()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var controller = new TeacherController(context);

    var dto = new TeacherDTO
    {
        Name = "Rachel",
        EmployeeCode = "999",
        WeeklyHours = 25,
        IsClassTeacher = true,
        IsGroupingTeacher = false,
        ClassName = "ח1",
        PreferredDayOffA = "Sunday",
        PreferredDayOffB = "Monday",
        PreferredDayOffC = "Tuesday"
    };

    var result = await controller.CreateTeacher(dto);

    Assert.IsType<OkObjectResult>(result);

    Assert.Single(context.Teachers);

    Assert.Equal("Rachel", context.Teachers.First().Name);
}

[Fact]
public async Task CreateTeacher_ShouldReturnConflict_WhenEmployeeCodeExists()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    context.Teachers.Add(new Teacher
    {
        Name = "Sara",
        EmployeeCode = "123"
    });

    await context.SaveChangesAsync();

    var controller = new TeacherController(context);

    var dto = new TeacherDTO
    {
        Name = "Rachel",
        EmployeeCode = "123"
    };

    var result = await controller.CreateTeacher(dto);

    Assert.IsType<ConflictObjectResult>(result);
}

[Fact]
public async Task GetTeachers_ShouldReturnAllTeachers()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    context.Teachers.Add(new Teacher
    {
        Name = "A",
        EmployeeCode = "1"
    });

    context.Teachers.Add(new Teacher
    {
        Name = "B",
        EmployeeCode = "2"
    });

    await context.SaveChangesAsync();

    var controller = new TeacherController(context);

    var result = await controller.GetTeachers();

    Assert.Equal(2, result.Value.Count());
}

[Fact]
public async Task UpdateTeacher_ShouldUpdateTeacher()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var teacher = new Teacher
    {
        TeacherID = Guid.NewGuid(),
        Name = "OldName",
        EmployeeCode = "111"
    };

    context.Teachers.Add(teacher);

    await context.SaveChangesAsync();

    var controller = new TeacherController(context);

    var dto = new TeacherDTO
    {
        Name = "NewName",
        EmployeeCode = "222"
    };

    var result = await controller.UpdateTeacher(teacher.TeacherID, dto);

    Assert.IsType<NoContentResult>(result);

    var updated = await context.Teachers.FindAsync(teacher.TeacherID);

    Assert.Equal("NewName", updated.Name);
    Assert.Equal("222", updated.EmployeeCode);
}

[Fact]
public async Task UpdateTeacher_ShouldReturnNotFound_WhenTeacherMissing()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var controller = new TeacherController(context);

    var dto = new TeacherDTO
    {
        Name = "NewName"
    };

    var result = await controller.UpdateTeacher(Guid.NewGuid(), dto);

    Assert.IsType<NotFoundObjectResult>(result);
}

[Fact]
public async Task MoveTeacherToHistory_ShouldMoveTeacher()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var teacher = new Teacher
    {
        TeacherID = Guid.NewGuid(),
        Name = "Sara",
        EmployeeCode = "123"
    };

    context.Teachers.Add(teacher);

    await context.SaveChangesAsync();

    var controller = new TeacherController(context);

    var result = await controller.MoveTeacherToHistory(teacher.TeacherID);

    Assert.IsType<OkObjectResult>(result);

    Assert.Empty(context.Teachers);

    Assert.Single(context.TeachersHistory);
}

[Fact]
public async Task MoveTeacherToHistory_ShouldReturnNotFound()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    var controller = new TeacherController(context);

    var result = await controller.MoveTeacherToHistory(Guid.NewGuid());

    Assert.IsType<NotFoundResult>(result);
}

[Fact]
public async Task GetTeachers_ShouldRespectPaging()
{
    var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

    for (int i = 0; i < 5; i++)
    {
        context.Teachers.Add(new Teacher
        {
            Name = $"Teacher{i}",
            EmployeeCode = $"{i}"
        });
    }

    await context.SaveChangesAsync();

    var controller = new TeacherController(context);

    var result = await controller.GetTeachers(0, 2);

    Assert.Equal(2, result.Value.Count());
}
}