using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ScheduleContext _context;

        public EmployeeController(ScheduleContext context)
        {
            _context = context;
        }

        // POST: api/Employee/new
        [HttpPost("new")]
        public async Task<ActionResult<Employee>> CreateEmployee(EmployeeDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.EmployeeCode))
            {
                return BadRequest("Invalid data");
            }

            var employee = new Employee
            {
                Name = dto.Name,
                EmployeeCode = dto.EmployeeCode
            };

            _context.Employees.Add(employee);

            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        // GET: api/Employee/all
        [HttpGet("all")]
        public async Task<ActionResult<List<Employee>>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        // PUT: api/Employee/delete/{id}
        [HttpPut("delete/{id}")]
        public async Task<IActionResult> MoveToHistory(Guid id)
        {
            var employee =
                await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            var history = new EmployeeHistory
            {
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                EmployeeCode = employee.EmployeeCode,
                UpdateHistory = DateTime.UtcNow
            };

            _context.EmployeesHistory.Add(history);

            _context.Employees.Remove(employee);

            await _context.SaveChangesAsync();

            return Ok();
        }
        
    }
}