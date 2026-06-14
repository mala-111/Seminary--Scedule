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
            Day = "Sunday",
            Hour = "08:00-09:00",
            TeacherID = Guid.NewGuid(),
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        };

        var result = await controller.CreateSchedule(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var schedule = Assert.IsType<Schedule>(created.Value);

        Assert.Equal("Sunday", schedule.Day);
        Assert.Equal("08:00-09:00", schedule.Hour);
    }

    [Fact]
    public async Task GetSchedules_ShouldReturnSchedules()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        context.Schedules.Add(new Schedule
        {
            Day = "Monday",
            Hour = "10:00",
            TeacherID = Guid.NewGuid(),
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        await context.SaveChangesAsync();

        var controller = new ScheduleController(context);

        var result = await controller.GetSchedules();

        var ok = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);

        Assert.Single(list);
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
            Day = "Sunday",
            Hour = "08:00",
            SubjectID = Guid.NewGuid(),
            AllClassesID = Guid.NewGuid()
        });

        context.Schedules.Add(new Schedule
        {
            TeacherID = Guid.NewGuid(),
            Day = "Monday",
            Hour = "09:00",
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
                Day = "Day" + i,
                Hour = "Hour",
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

        // חשוב אחרי הוספת OrderBy → בדיקה שהסדר יציב
        Assert.Equal(list.First().ScheduleId, list.OrderBy(x => x.ScheduleId).First().ScheduleId);
    }

    [Fact]
    public async Task MoveSchedulesToHistory_ShouldClearAndArchive()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        context.Schedules.Add(new Schedule
        {
            Day = "Sunday",
            Hour = "08:00",
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