using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public TeacherController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // POST: /manager/home/newTeacher
        // הכנסת מורה חדש למערכת
        [HttpPost("newTeacher")]
        public async Task<ActionResult<Teacher>> CreateTeacher(TeacherDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.EmployeeCode))
            {
                return BadRequest("שם וקוד עובד הם חובה.");
            }

            if (_ScheduleContext.Teachers.Any(a => a.EmployeeCode == dto.EmployeeCode))
            {
                return Conflict("מורה עם קוד עובד זה כבר קיים.");
            }

            var teacher = new Teacher
            {
                Name = dto.Name.Trim(),
                EmployeeCode = dto.EmployeeCode.Trim(),
                WeeklyHours = dto.WeeklyHours,
                PreferredDayOff = dto.PreferredDayOff,
                IsClassTeacher = dto.IsClassTeacher,
                IsGroupingTeacher = dto.IsGroupingTeacher
            };

            _ScheduleContext.Teachers.Add(teacher);
            await _ScheduleContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeachers), new { id = teacher.TeacherID }, teacher);
        }

        // GET: /manager/home/showSchedule/employees/all
        // הצגת מערכת השעות הכללית לפי מורים
        [HttpGet("showSchedule/employees/all")]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers(int skip = 0, int take = 10)
        {
            return await _ScheduleContext.Teachers.Skip(skip).Take(take).ToListAsync();
        }

        // PUT: /manager/home/update/DetailsTeacher
        // עדכון פרטי מורה
        [HttpPut("update/DetailsTeacher/{id}")]
        public async Task<IActionResult> UpdateTeacher(Guid id, TeacherDTO dto)
        {
            var teacher = await _ScheduleContext.Teachers.FindAsync(id);
            if (teacher == null) return NotFound("מורה לא נמצא.");

            teacher.Name = dto.Name ?? teacher.Name;
            teacher.EmployeeCode = dto.EmployeeCode ?? teacher.EmployeeCode;
            teacher.WeeklyHours = dto.WeeklyHours;
            teacher.PreferredDayOff = dto.PreferredDayOff;
            teacher.IsClassTeacher = dto.IsClassTeacher;
            teacher.IsGroupingTeacher = dto.IsGroupingTeacher;

            await _ScheduleContext.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: /manager/home/delete/user
        // מחיקת מורה
        // [HttpDelete("delete/user/{id}")]
        // public async Task<IActionResult> DeleteTeacher(Guid id)
        // {
        //     var teacher = await _ScheduleContext.Teachers.FindAsync(id);
        //     if (teacher == null) return NotFound("מורה לא נמצא.");

        //     _ScheduleContext.Teachers.Remove(teacher);
        //     await _ScheduleContext.SaveChangesAsync();
        //     return NoContent();
        // }

        [HttpPut("delete/user/{id}")]
public async Task<IActionResult> MoveTeacherToHistory(Guid id)
{
    var teacher = await _ScheduleContext.Teachers.FindAsync(id);
    if (teacher == null) return NotFound();

    var history = new TeacherHistory
    {
        TeacherID = teacher.TeacherID,
        Name = teacher.Name,
        EmployeeCode = teacher.EmployeeCode,
        WeeklyHours = teacher.WeeklyHours,
        PreferredDayOff = teacher.PreferredDayOff,
        IsClassTeacher = teacher.IsClassTeacher,
        IsGroupingTeacher = teacher.IsGroupingTeacher,
        UpdateHistory = DateTime.UtcNow
    };

    _ScheduleContext.TeachersHistory.Add(history);
    _ScheduleContext.Teachers.Remove(teacher);

    await _ScheduleContext.SaveChangesAsync();
    return Ok(new { message = "Teacher moved to history successfully", historyId = history.HistoryId });
}
    }
}