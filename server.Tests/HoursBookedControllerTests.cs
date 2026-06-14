using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;

public class HoursBookedControllerTests
{
    private HoursBookedController CreateController(string dbName)
    {
        var context = InMemoryDbContext.GetContext(dbName);
        return new HoursBookedController(context);
    }

    [Fact]
    public async Task BookHours_ShouldCreateBooking()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var dto = new HoursBookedDTO
        {
            TeacherID = Guid.NewGuid(),
            Day = "Sunday",
            HourStart = new TimeSpan(8, 0, 0),
            HourEnd = new TimeSpan(10, 0, 0),
            Reason = "Meeting"
        };

        var result = await controller.BookHours(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var booking = Assert.IsType<HoursBooked>(created.Value);

        Assert.Equal("Sunday", booking.Day);
        Assert.Equal("Meeting", booking.Reason);
    }

    [Fact]
    public async Task GetAllBookedHours_ShouldReturnOnlyTeacherHours()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        var teacherId = Guid.NewGuid();

        context.HoursBooked.Add(new HoursBooked
        {
            TeacherID = teacherId,
            Day = "Sunday",
            HourStart = new TimeSpan(8, 0, 0),
            HourEnd = new TimeSpan(9, 0, 0),
            Reason = "Test"
        });

        context.HoursBooked.Add(new HoursBooked
        {
            TeacherID = Guid.NewGuid(),
            Day = "Monday",
            HourStart = new TimeSpan(10, 0, 0),
            HourEnd = new TimeSpan(11, 0, 0),
            Reason = "Other"
        });

        await context.SaveChangesAsync();

        var controller = new HoursBookedController(context);

        var result = await controller.GetAllBookedHours(teacherId);

        var ok = Assert.IsType<ActionResult<IEnumerable<HoursBooked>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<HoursBooked>>(ok.Value);

        Assert.Single(list);
    }

    [Fact]
    public async Task MoveBookedHours_ShouldMoveToHistory()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        var booking = new HoursBooked
        {
            TeacherID = Guid.NewGuid(),
            Day = "Tuesday",
            HourStart = new TimeSpan(9, 0, 0),
            HourEnd = new TimeSpan(10, 0, 0),
            Reason = "Lesson"
        };

        context.HoursBooked.Add(booking);
        await context.SaveChangesAsync();

        var controller = new HoursBookedController(context);

        var result = await controller.MoveBookedHoursToHistory(booking.BookingID);

        var ok = Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.HoursBooked.Where(x => x.BookingID == booking.BookingID));
        Assert.Single(context.HoursBookedHistory);
    }

    [Fact]
    public async Task MoveBookedHours_ShouldReturnNotFound_WhenMissing()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var result = await controller.MoveBookedHoursToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result);
    }
}