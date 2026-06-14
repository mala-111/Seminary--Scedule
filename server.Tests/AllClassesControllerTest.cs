using Xunit;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

public class AllClassesControllerTests
{
    [Fact]
    public async Task GetAllClasses_ShouldReturnClasses()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        context.AllClasses.Add(new AllClasses { ClassName = "ז1" });
        context.AllClasses.Add(new AllClasses { ClassName = "ז2" });

        await context.SaveChangesAsync();

        var controller = new AllClassesController(context);

        var result = await controller.GetAllClasses();

        var classes = Assert.IsType<List<AllClasses>>(result.Value);

        Assert.Equal(2, classes.Count);
    }

    [Fact]
    public async Task GetAllClasses_ShouldRespectPaging()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        for (int i = 1; i <= 5; i++)
        {
            context.AllClasses.Add(new AllClasses
            {
                ClassName = $"Class{i}"
            });
        }

        await context.SaveChangesAsync();

        var controller = new AllClassesController(context);

        var result = await controller.GetAllClasses(2, 2);

        var classes = Assert.IsType<List<AllClasses>>(result.Value);

        Assert.Equal(2, classes.Count);
    }

    [Fact]
    public async Task CreateClass_ShouldCreateClass()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new AllClassesController(context);

        var dto = new AllClassesDTO
        {
            Name = "ז3"
        };

        var result = await controller.CreateClass(dto);

        Assert.IsType<CreatedAtActionResult>(result.Result);

        Assert.Single(context.AllClasses);
    }

    [Fact]
    public async Task CreateClass_ShouldReturnBadRequest_WhenNameEmpty()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new AllClassesController(context);

        var dto = new AllClassesDTO
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

        context.AllClasses.Add(new AllClasses
        {
            ClassName = "ז1"
        });

        await context.SaveChangesAsync();

        var controller = new AllClassesController(context);

        var dto = new AllClassesDTO
        {
            Name = "ז1"
        };

        var result = await controller.CreateClass(dto);

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task MoveClassToHistory_ShouldMoveClass()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var cls = new AllClasses
        {
            ClassName = "ז5"
        };

        context.AllClasses.Add(cls);

        await context.SaveChangesAsync();

        var controller = new AllClassesController(context);

        var result = await controller.MoveClassToHistory(cls.AllClassesID);

        Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.AllClasses);

        Assert.Single(context.AllClassesHistory);
    }

    [Fact]
    public async Task MoveClassToHistory_ShouldReturnNotFound()
    {
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        var controller = new AllClassesController(context);

        var result = await controller.MoveClassToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result);
    }
}