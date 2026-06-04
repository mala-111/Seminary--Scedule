using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DaughtersTeacherController : ControllerBase
    {
        private readonly ScheduleContext _context;

        public DaughtersTeacherController(ScheduleContext context)
        {
            _context = context;
        }

        // POST: api/DaughtersTeacher/new
        [HttpPost("new")]
        public async Task<ActionResult<DaughtersTeacher>> CreateDaughtersTeacher(DaughtersTeacherDTO dto)
        {
            if (dto == null || dto.TeacherID == Guid.Empty || string.IsNullOrEmpty(dto.ClassName))
            {
                return BadRequest("Invalid data.");
            }

            var daughterTeacher = new DaughtersTeacher
            {
                TeacherID = dto.TeacherID,
                ClassName = dto.ClassName
            };

            _context.DaughtersTeachers.Add(daughterTeacher);
            await _context.SaveChangesAsync();

            return Ok(daughterTeacher);
        }

        // PUT: api/DaughtersTeacher/delete/{id}
        [HttpPut("delete/{id}")]
        public async Task<IActionResult> MoveDaughtersTeacherToHistory(Guid id)
        {
            var entity = await _context.DaughtersTeachers.FindAsync(id);
            if (entity == null)
                return NotFound("Teacher-class record not found.");

            // העתקה להיסטוריה
            var history = new DaughtersTeacherHistory
            {
                ClassDaughtersTeacherID = entity.ClassDaughtersTeacherID,
                TeacherID = entity.TeacherID,
                ClassName = entity.ClassName,
                UpdateHistory = DateTime.UtcNow
            };

            _context.DaughtersTeachersHistory.Add(history);
            _context.DaughtersTeachers.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Moved to history successfully", historyId = history.HistoryId });
        }

        // GET: api/DaughtersTeacher/all
        [HttpGet("all")]
        public async Task<ActionResult<List<DaughtersTeacher>>> GetAll()
        {
            return await _context.DaughtersTeachers
                .Include(d => d.Teacher) // אם רוצים גם את פרטי המורה
                .ToListAsync();
        }
    }
}