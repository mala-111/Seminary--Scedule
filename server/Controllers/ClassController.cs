using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public ClassController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // GET: /manager/home/showSchedule/Grades
        // הצגת מערכת השעות הכללית לפי כיתות
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Class>>> GetShowScheduleGrades(int skip = 0, int take = 1000)
        {
            return await _ScheduleContext.Grades.Skip(skip).Take(take).ToListAsync();
        }

        // POST: /manager/home/newClass
        // הכנסת כיתה חדשה למערכת
        [HttpPost]
        public async Task<ActionResult<Class>> CreateClass(ClassDTO cl)
        {
            if (string.IsNullOrWhiteSpace(cl.Name))
            {
                return BadRequest("שם הכיתה הוא חובה.");
            }

            if (_ScheduleContext.Grades.Any(a => a.Name != null && a.Name.Trim().ToUpper() == cl.Name.Trim().ToUpper()))
            {
                return Conflict("כיתה עם שם זה כבר קיימת.");
            }

            var classEntity = new Class
            {
                Name = cl.Name.Trim()
            };

            _ScheduleContext.Grades.Add(classEntity);
            await _ScheduleContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShowScheduleGrades), new { id = classEntity.ClassID }, classEntity);
        }

        // DELETE: /manager/home/delete/class
        // מחיקת כיתה
        // [HttpDelete("delete/class/{id}")]
        // public async Task<IActionResult> DeleteClass(Guid id)
        // {
        //     var classEntity = await _ScheduleContext.Grades.FindAsync(id);
        //     if (classEntity == null)
        //     {
        //         return NotFound("כיתה לא נמצאה.");
        //     }

        //     _ScheduleContext.Grades.Remove(classEntity);
        //     await _ScheduleContext.SaveChangesAsync();

        //     return NoContent();
        // }

        [HttpPut("{id}")]
public async Task<IActionResult> MoveClassToHistory(Guid id)
{
    var classEntity = await _ScheduleContext.Grades.FindAsync(id);
    if (classEntity == null) return NotFound();

    var history = new ClassHistory
    {
        ClassID = classEntity.ClassID,
        Name = classEntity.Name,
        UpdateHistory = DateTime.UtcNow
    };

    _ScheduleContext.GradesHistory.Add(history);
    _ScheduleContext.Grades.Remove(classEntity);

    await _ScheduleContext.SaveChangesAsync();
    return Ok(new { message = "Class moved to history successfully", historyId = history.HistoryId });
}
    }
}