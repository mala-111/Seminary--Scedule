using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public SubjectController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // POST: /manager/home/addSubject
        // הוספת מקצוע חדש
        [HttpPost("addSubject")]
        public async Task<ActionResult<Subject>> AddSubject(SubjectDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("שם מקצוע חובה.");
            }

            if (_ScheduleContext.Subjects.Any(a => a.Name.ToUpper() == dto.Name.Trim().ToUpper()))
            {
                return Conflict("מקצוע זה כבר קיים.");
            }

            var subject = new Subject {
                 Name = dto.Name.Trim(),
             Category = dto.Category};
            _ScheduleContext.Subjects.Add(subject);
            await _ScheduleContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSubjects), new { id = subject.SubjectID }, subject);
        }

        // GET: /employee/home/showSchedule/subject
        // צפייה במקצועות
       [HttpGet("showSchedule/subject")]
public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
{
    return await _ScheduleContext.Subjects.ToListAsync();
}

        // DELETE: /manager/home/delete/subject
        // מחיקת מקצוע
        // [HttpDelete("delete/subject/{id}")]
        // public async Task<IActionResult> DeleteSubject(Guid id)
        // {
        //     var subject = await _ScheduleContext.Subjects.FindAsync(id);
        //     if (subject == null) return NotFound("מקצוע לא נמצא.");

        //     _ScheduleContext.Subjects.Remove(subject);
        //     await _ScheduleContext.SaveChangesAsync();
        //     return NoContent();
        // }


        [HttpPut("delete/subject/{name}")]
public async Task<IActionResult> MoveSubjectToHistory(string name)
{
    // חיפוש לפי שם במקום FindAsync
    var subject = await _ScheduleContext.Subjects
        .FirstOrDefaultAsync(s => s.Name == name);

    if (subject == null) 
        return NotFound("המקצוע לא נמצא.");

    var history = new SubjectHistory
    {
        SubjectID = subject.SubjectID,
        Name = subject.Name,
        Category = subject.Category,
        UpdateHistory = DateTime.UtcNow
    };

    _ScheduleContext.SubjectsHistory.Add(history);
    _ScheduleContext.Subjects.Remove(subject);

    await _ScheduleContext.SaveChangesAsync();
    return Ok(new { message = "Subject moved to history successfully", historyId = history.HistoryId });
}
    }
}