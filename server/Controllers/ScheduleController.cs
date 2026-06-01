using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public ScheduleController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // POST: /manager/home/schedule
        // יצירת מערכת שעות
        [HttpPost("schedule")]
        public async Task<ActionResult<Schedule>> CreateSchedule(ScheduleDTO dto)
        {
            var schedule = new Schedule
            {
                Day = dto.Day,
                Hour = dto.Hour
                // TeacherID, SubjectID, AllClassesID יש למלא לפי המימוש האמיתי
            };

            _ScheduleContext.Schedules.Add(schedule);
            await _ScheduleContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSchedules), new { id = schedule.ScheduleId }, schedule);
        }

        // GET: /employee/home/showSchedule/allPersonal
        // צפייה במערכת האישית
        [HttpGet("showSchedule/allPersonal")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetPersonalSchedules(Guid teacherId)
        {
            return await _ScheduleContext.Schedules
                .Where(s => s.TeacherID == teacherId)
                .ToListAsync();
        }

        // GET: /employee/home/showSchedule/all
        // צפייה במערכת הכללית
        [HttpGet("showSchedule/all")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules(int skip = 0, int take = 20)
        {
            return await _ScheduleContext.Schedules.Skip(skip).Take(take).ToListAsync();
        }

        // DELETE: /manager/home/resetSchedule
        // איפוס המערכת
        // [HttpDelete("resetSchedule")]
        // public async Task<IActionResult> ResetSchedule()
        // {
        //     _ScheduleContext.Schedules.RemoveRange(_ScheduleContext.Schedules);
        //     await _ScheduleContext.SaveChangesAsync();
        //     return NoContent();
        // }

        [HttpPut("resetSchedule")]
public async Task<IActionResult> MoveSchedulesToHistory()
{
    var schedules = await _ScheduleContext.Schedules.ToListAsync();
    foreach(var s in schedules)
    {
        var history = new ScheduleHistory
        {
            ScheduleId = s.ScheduleId,
            TeacherID = s.TeacherID,
            SubjectID = s.SubjectID,
            AllClassesID = s.AllClassesID,
            Day = s.Day,
            Hour = s.Hour,
            UpdateHistory = DateTime.UtcNow
        };
        _ScheduleContext.SchedulesHistory.Add(history);
    }

    _ScheduleContext.Schedules.RemoveRange(schedules);
    await _ScheduleContext.SaveChangesAsync();

    return Ok(new { message = "All schedules moved to history successfully" });
}
    }
}