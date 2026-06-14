using Xunit;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ClassControllerTests
{
    [Fact]
    public async Task GetShowScheduleGrades_ShouldReturnClasses()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        context.Grades.Add(new Class { Name = "ז1" });
        context.Grades.Add(new Class { Name = "ז2" });

        await context.SaveChangesAsync();

        var controller = new ClassController(context);

        var result = await controller.GetShowScheduleGrades();

        var classes = Assert.IsType<List<Class>>(result.Value);

        Assert.Equal(2, classes.Count);
    }

    [Fact]
    public async Task GetShowScheduleGrades_ShouldRespectPaging()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        for (int i = 1; i <= 5; i++)
        {
            context.Grades.Add(new Class
            {
                Name = $"Class{i}"
            });
        }

        await context.SaveChangesAsync();

        var controller = new ClassController(context);

        var result = await controller.GetShowScheduleGrades(2, 2);

        var classes = Assert.IsType<List<Class>>(result.Value);

        Assert.Equal(2, classes.Count);
    }

    [Fact]
    public async Task CreateClass_ShouldCreateClass()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new ClassController(context);

        var dto = new ClassDTO
        {
            Name = "ח1"
        };

        var result = await controller.CreateClass(dto);

        Assert.IsType<CreatedAtActionResult>(result.Result);

        Assert.Single(context.Grades);
    }

    [Fact]
    public async Task CreateClass_ShouldReturnBadRequest_WhenNameEmpty()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new ClassController(context);

        var dto = new ClassDTO
        {
            Name = ""
        };

        var result = await controller.CreateClass(dto);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateClass_ShouldReturnConflict_WhenClassExists()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        context.Grades.Add(new Class
        {
            Name = "ח1"
        });

        await context.SaveChangesAsync();

        var controller = new ClassController(context);

        var dto = new ClassDTO
        {
            Name = "ח1"
        };

        var result = await controller.CreateClass(dto);

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task MoveClassToHistory_ShouldMoveClass()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var cls = new Class
        {
            Name = "ח2"
        };

        context.Grades.Add(cls);

        await context.SaveChangesAsync();

        var controller = new ClassController(context);

        var result = await controller.MoveClassToHistory(cls.ClassID);

        Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.Grades);

        Assert.Single(context.GradesHistory);
    }

    [Fact]
    public async Task MoveClassToHistory_ShouldReturnNotFound()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new ClassController(context);

        var result = await controller.MoveClassToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result);
    }
}