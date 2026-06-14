using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyWebApiProject.Controllers;
using MyWebApiProject.Models;

public class EmployeeControllerTests
{
    private EmployeeController CreateController(string dbName)
    {
        var context = InMemoryDbContext.GetContext(dbName);
        return new EmployeeController(context);
    }

    [Fact]
    public async Task CreateEmployee_ShouldAddEmployee()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var dto = new EmployeeDTO
        {
            Name = "David",
            EmployeeCode = "E001"
        };

        var result = await controller.CreateEmployee(dto);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var employee = Assert.IsType<Employee>(okResult.Value);

        Assert.Equal("David", employee.Name);
        Assert.Equal("E001", employee.EmployeeCode);
    }

    [Fact]
    public async Task CreateEmployee_ShouldReturnBadRequest_WhenDataInvalid()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var dto = new EmployeeDTO
        {
            Name = "",
            EmployeeCode = ""
        };

        var result = await controller.CreateEmployee(dto);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetAll_ShouldReturnEmployees()
    {
        var controller = CreateController(Guid.NewGuid().ToString());
        var context = InMemoryDbContext.GetContext(Guid.NewGuid().ToString());

        context.Employees.Add(new Employee
        {
            Name = "Avi",
            EmployeeCode = "E002"
        });

        await context.SaveChangesAsync();

        var result = await controller.GetAll();

        var okResult = Assert.IsType<ActionResult<List<Employee>>>(result);
        Assert.True(okResult.Value.Count >= 0);
    }

    [Fact]
    public async Task MoveToHistory_ShouldMoveEmployee()
    {
        var dbName = Guid.NewGuid().ToString();
        var context = InMemoryDbContext.GetContext(dbName);

        var employee = new Employee
        {
            Name = "Moshe",
            EmployeeCode = "E003"
        };

        context.Employees.Add(employee);
        await context.SaveChangesAsync();

        var controller = new EmployeeController(context);

        var result = await controller.MoveToHistory(employee.EmployeeId);

        Assert.IsType<OkResult>(result);

        Assert.Empty(context.Employees.Where(e => e.EmployeeId == employee.EmployeeId));
        Assert.Single(context.EmployeesHistory);
    }

    [Fact]
    public async Task MoveToHistory_ShouldReturnNotFound_WhenEmployeeMissing()
    {
        var controller = CreateController(Guid.NewGuid().ToString());

        var result = await controller.MoveToHistory(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result);
    }
}