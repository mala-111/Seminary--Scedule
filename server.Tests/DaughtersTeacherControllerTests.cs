using Xunit;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class DaughtersTeacherControllerTests
{
    [Fact]
    public async Task CreateDaughtersTeacher_ShouldAddEntity()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new DaughtersTeacherController(context);

        var dto = new DaughtersTeacher
        {
            TeacherID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        };

        var result = await controller.CreateDaughtersTeacher(dto);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);

        Assert.Single(context.DaughtersTeachers);
    }

    [Fact]
    public async Task CreateDaughtersTeacher_ShouldReturnBadRequest_WhenInvalid()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new DaughtersTeacherController(context);

        var dto = new DaughtersTeacher
        {
            TeacherID = Guid.Empty,
            AllClassesID = Guid.Empty
        };

        var result = await controller.CreateDaughtersTeacher(dto);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        context.DaughtersTeachers.Add(new DaughtersTeacher
        {
            TeacherID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        context.DaughtersTeachers.Add(new DaughtersTeacher
        {
            TeacherID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        await context.SaveChangesAsync();

        var controller = new DaughtersTeacherController(context);

        var result = await controller.GetAll();

        var list = Assert.IsType<List<DaughtersTeacher>>(result.Value);

        Assert.Equal(2, list.Count);
    }

    [Fact]
    public async Task MoveToHistory_ShouldMoveEntity()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var entity = new DaughtersTeacher
        {
            TeacherID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        };

        context.DaughtersTeachers.Add(entity);
        await context.SaveChangesAsync();

        var controller = new DaughtersTeacherController(context);

        var result = await controller.MoveDaughtersTeacherToHistory(entity.ClassDaughtersTeacherID);

        var ok = Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.DaughtersTeachers);
        Assert.Single(context.DaughtersTeachersHistory);
    }

    [Fact]
    public async Task MoveToHistory_ShouldReturnNotFound()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new DaughtersTeacherController(context);

        var result = await controller.MoveDaughtersTeacherToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundObjectResult>(result);
    }
}