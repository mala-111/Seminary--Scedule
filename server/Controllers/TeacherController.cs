using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public TeacherController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }
               [HttpGet("{id}")]
public async Task<ActionResult<Teacher>> GetTeacher(Guid id)
{
    var teacher = await _ScheduleContext.Teachers.FindAsync(id);
    if (teacher == null) return NotFound();
    return teacher;
}
        // POST: /manager/home/newTeacher
        // הכנסת מורה חדש למערכת
          [HttpPost("newTeacher")]
        public async Task<IActionResult> CreateTeacher(TeacherDTO dto)
        {
            // בדיקה אם כבר קיים מורה עם אותו EmployeeCode
            var exists = await _ScheduleContext.Teachers
                .AnyAsync(t => t.EmployeeCode == dto.EmployeeCode);

            if (exists)
            {
                return Conflict(new { message = "Teacher with this employee code already exists." });
            }

            // יצירת אובייקט חדש
            var teacher = new Teacher
            {
                TeacherID = Guid.NewGuid(),
                EmployeeCode = dto.EmployeeCode,
                Name = dto.Name,
                WeeklyHours = dto.WeeklyHours,
                IsClassTeacher = dto.IsClassTeacher,
                IsGroupingTeacher = dto.IsGroupingTeacher,
                PreferredDayOffA = dto.PreferredDayOffA,
                PreferredDayOffB = dto.PreferredDayOffB,
                PreferredDayOffC = dto.PreferredDayOffC,
                ClassName = dto.ClassName,
            };

            _ScheduleContext.Teachers.Add(teacher);
            await _ScheduleContext.SaveChangesAsync();

            // מחזיר את האובייקט שנוצר עם קוד 201 Created
           return Ok(teacher);
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
            if (!string.IsNullOrWhiteSpace(dto.EmployeeCode))
                  teacher.EmployeeCode = dto.EmployeeCode.Trim();
            teacher.WeeklyHours = dto.WeeklyHours;
            teacher.PreferredDayOffA = dto.PreferredDayOffA;
                        teacher.PreferredDayOffB = dto.PreferredDayOffB;

            teacher.PreferredDayOffB = dto.PreferredDayOffB;

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
        PreferredDayOffA = teacher.PreferredDayOffA,
                PreferredDayOffB = teacher.PreferredDayOffB,
        PreferredDayOffC = teacher.PreferredDayOffC,
        ClassName = teacher.ClassName,

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