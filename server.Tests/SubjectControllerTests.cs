using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Controllers;
using MyWebApiProject.Data;
using MyWebApiProject.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

public class SubjectControllerTests
{
    private ScheduleContext GetContext()
    {
        return InMemoryDbContext.GetContext(Guid.NewGuid().ToString());
    }

    [Fact]
    public async Task AddSubject_ShouldCreateSubject()
    {
        // Arrange
        var context = GetContext();
        var controller = new SubjectController(context);

        var dto = new SubjectDTO
        {
            Name = "Math",
            Category = "Science"
        };

        // Act
        var result = await controller.AddSubject(dto);

        // Assert
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var subject = Assert.IsType<Subject>(created.Value);

        Assert.Equal("Math", subject.Name);
        Assert.Equal("Science", subject.Category);

        Assert.Equal(1, context.Subjects.Count());
    }

    [Fact]
    public async Task AddSubject_ShouldReturnBadRequest_WhenNameEmpty()
    {
        // Arrange
        var context = GetContext();
        var controller = new SubjectController(context);

        var dto = new SubjectDTO
        {
            Name = "",
            Category = "Science"
        };

        // Act
        var result = await controller.AddSubject(dto);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("שם מקצוע חובה.", badRequest.Value);
    }

    [Fact]
    public async Task AddSubject_ShouldReturnConflict_WhenSubjectExists()
    {
        // Arrange
        var context = GetContext();

        context.Subjects.Add(new Subject
        {
            Name = "Math",
            Category = "Science"
        });
        await context.SaveChangesAsync();

        var controller = new SubjectController(context);

        var dto = new SubjectDTO
        {
            Name = "Math",
            Category = "Science"
        };

        // Act
        var result = await controller.AddSubject(dto);

        // Assert
        var conflict = Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.Equal("מקצוע זה כבר קיים.", conflict.Value);
    }

    [Fact]
    public async Task GetSubjects_ShouldReturnAllSubjects()
    {
        // Arrange
        var context = GetContext();

        context.Subjects.Add(new Subject { Name = "Math", Category = "Science" });
        context.Subjects.Add(new Subject { Name = "English", Category = "Language" });
        await context.SaveChangesAsync();

        var controller = new SubjectController(context);

        // Act
        var result = await controller.GetSubjects();

        // Assert
        var ok = Assert.IsType<ActionResult<IEnumerable<Subject>>>(result);
        var list = Assert.IsAssignableFrom<System.Collections.Generic.List<Subject>>(ok.Value);

        Assert.Equal(2, list.Count);
    }

    [Fact]
    public async Task GetSubjects_ShouldReturnEmpty_WhenNoData()
    {
        // Arrange
        var context = GetContext();
        var controller = new SubjectController(context);

        // Act
        var result = await controller.GetSubjects();

        // Assert
        var ok = Assert.IsType<ActionResult<IEnumerable<Subject>>>(result);
        var list = Assert.IsAssignableFrom<System.Collections.Generic.List<Subject>>(ok.Value);

        Assert.Empty(list);
    }

    [Fact]
    public async Task MoveSubjectToHistory_ShouldMoveSubject()
    {
        // Arrange
        var context = GetContext();

        var subject = new Subject
        {
            Name = "Math",
            Category = "Science"
        };

        context.Subjects.Add(subject);
        await context.SaveChangesAsync();

        var controller = new SubjectController(context);

        // Act
        var result = await controller.MoveSubjectToHistory(subject.Name);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);

        Assert.Empty(context.Subjects);
        Assert.Single(context.SubjectsHistory);
    }

    [Fact]
    public async Task MoveSubjectToHistory_ShouldReturnNotFound()
    {
        // Arrange
        var context = GetContext();
        var controller = new SubjectController(context);

        // Act
        var result = await controller.MoveSubjectToHistory("NotExist");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}