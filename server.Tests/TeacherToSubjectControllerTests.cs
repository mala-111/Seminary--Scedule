using Xunit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyWebApiProject.Controllers;
using MyWebApiProject.Data;
using MyWebApiProject.Models;
using System.Linq;
using System.Collections.Generic;

public class TeacherToSubjectControllerTests
{
    private ScheduleContext GetContext()
    {
        return InMemoryDbContext.GetContext(Guid.NewGuid().ToString());
    }

    private async Task SeedAsync(ScheduleContext context)
    {
        var teacher = new Teacher
        {
            TeacherID = Guid.NewGuid(),
            Name = "Test",
            EmployeeCode = "T1",
            WeeklyHours = 20,
            IsClassTeacher = true,
            IsGroupingTeacher = false,
            ClassName = "A1",
            PreferredDayOffA = "Sun",
            PreferredDayOffB = "Mon",
            PreferredDayOffC = "Tue"
        };

        var subject = new Subject
        {
            SubjectID = Guid.NewGuid(),
            Name = "Math",
            Category = "Science"
        };

        var cls = new Class
        {
            ClassID = Guid.NewGuid(),
            Name = "A1"
        };

        context.Teachers.Add(teacher);
        context.Subjects.Add(subject);
        context.Grades.Add(cls);

        await context.SaveChangesAsync();

        context.TeacherToSubjects.Add(new TeacherToSubject
        {
            TeacherToSubjectId = Guid.NewGuid(),
            TeacherID = teacher.TeacherID,
            SubjectID = subject.SubjectID,
            ClassID = cls.ClassID
        });

        await context.SaveChangesAsync();
    }

    [Fact]
    public async Task GetAllAssignments_ShouldReturnAll()
    {
        // Arrange
        var context = GetContext();
        await SeedAsync(context);

        var controller = new TeacherToSubjectController(context);

        // Act
        var result = await controller.GetAllAssignments();

        // Assert
        var ok = Assert.IsType<ActionResult<IEnumerable<TeacherToSubject>>>(result);

        var list = ok.Value?.ToList();

        Assert.NotNull(list);
        Assert.True(list.Count > 0);
    }

    [Fact]
    public async Task AssignSubjectToTeacher_ShouldAddEntity()
    {
        var context = GetContext();
        await SeedAsync(context);

        var controller = new TeacherToSubjectController(context);

        var teacher = context.Teachers.First();
        var subject = context.Subjects.First();
        var cls = context.Grades.First();

        var dto = new TeacherToSubjectDTO
        {
            TeacherID = teacher.TeacherID,
            SubjectName = subject.Name,
            ClassName = cls.Name
        };

        var result = await controller.AssignSubjectToTeacher(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var value = Assert.IsType<TeacherToSubject>(created.Value);

        Assert.Equal(teacher.TeacherID, value.TeacherID);
    }

    [Fact]
    public async Task MoveToHistory_ShouldReturnNotFound()
    {
        var context = GetContext();
        var controller = new TeacherToSubjectController(context);

        var result = await controller.MoveTeacherToSubjectToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result);
    }
}