using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;

public class ScheduleControllerTests
{
    private ScheduleController CreateController(string dbName)
    {
        var context = InMemoryDbContext.GetContext(dbName);
        return new ScheduleController(context);
    }

    [Fact]
    public async Task CreateSchedule_ShouldAddSchedule()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var dto = new ScheduleDTO
        {
            Day = 1,
            Hour = 2,
            TeacherID = Guid.NewGuid(),
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        };

        var result = await controller.CreateSchedule(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var schedule = Assert.IsType<Schedule>(created.Value);

        Assert.Equal(1, schedule.Day);
        Assert.Equal(2, schedule.Hour);
    }

    [Fact]
    public async Task GetSchedules_ShouldReturnSchedules()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        context.Schedules.Add(new Schedule
        {
            Day = 1,
            Hour = 3,
            TeacherID = Guid.NewGuid(),
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        await context.SaveChangesAsync();

        var controller = new ScheduleController(context);

        var result = await controller.GetSchedules();

        var ok = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);

        Assert.True(list.Any());
    }

    [Fact]
    public async Task GetPersonalSchedules_ShouldFilterByTeacher()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        var teacherId = Guid.NewGuid();

        context.Schedules.Add(new Schedule
        {
            TeacherID = teacherId,
            Day = 1,
            Hour = 2,
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        context.Schedules.Add(new Schedule
        {
            TeacherID = Guid.NewGuid(),
            Day = 2,
            Hour =3,
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        await context.SaveChangesAsync();

        var controller = new ScheduleController(context);

        var result = await controller.GetPersonalSchedules(teacherId);

        var ok = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);

        Assert.Single(list);
    }

    [Fact]
    public async Task GetSchedules_ShouldRespectPaging()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        for (int i = 0; i < 30; i++)
        {
            context.Schedules.Add(new Schedule
            {
                Day = 1,
                Hour = i,
                TeacherID = Guid.NewGuid(),
                SubjectID = Guid.NewGuid(),
                AllClassesID = Guid.NewGuid()
            });
        }

        await context.SaveChangesAsync();

        var controller = new ScheduleController(context);

        var result = await controller.GetSchedules(skip: 0, take: 10);

        var ok = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);

        Assert.Equal(10, list.Count());
    }

    [Fact]
    public async Task MoveSchedulesToHistory_ShouldClearAndArchive()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        context.Schedules.Add(new Schedule
        {
            Day = 1,
            Hour = 1,
            TeacherID = Guid.NewGuid(),
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        await context.SaveChangesAsync();

        var controller = new ScheduleController(context);

        var result = await controller.MoveSchedulesToHistory();

        var ok = Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.Schedules);
        Assert.Single(context.SchedulesHistory);
    }
}