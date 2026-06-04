using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AllClassesController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public AllClassesController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // GET: /manager/home/showSchedule/classes
        // הצגת מערכת השעות הכללית לפי כיתות
        [HttpGet("showSchedule/classes")]
        public async Task<ActionResult<IEnumerable<AllClasses>>> GetAllClasses(int skip = 0, int take = 10)
        {
            return await _ScheduleContext.AllClasses.Skip(skip).Take(take).ToListAsync();
        }

        // POST: /manager/home/newClass
        // הכנסת כיתות למערכת
        [HttpPost("newClass")]
        public async Task<ActionResult<AllClasses>> CreateClass(AllClassesDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Class name is required.");

            if (_ScheduleContext.AllClasses.Any(c => c.ClassName.Trim().ToUpper() == dto.Name.Trim().ToUpper()))
                return Conflict("Class already exists.");

            var classEntity = new AllClasses { ClassName = dto.Name.Trim() };
            _ScheduleContext.AllClasses.Add(classEntity);
            await _ScheduleContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllClasses), new { id = classEntity.AllClassesID }, classEntity);
        }

        
[HttpPut("delete/{id}")]
public async Task<IActionResult> MoveClassToHistory(Guid id)
{
    // מציאת הכיתה המקורית
    var cls = await _ScheduleContext.AllClasses.FindAsync(id);
    if (cls == null) return NotFound();

    // יצירת רשומה בהיסטוריה
    var history = new AllClassesHistory
    {
        AllClassesID = cls.AllClassesID,
        ClassName = cls.ClassName,
        UpdateHistory = DateTime.UtcNow
    };

    _ScheduleContext.AllClassesHistory.Add(history);

    // אם רוצים למחוק מהטבלה המקורית אחרי שמירת ההיסטוריה:
    _ScheduleContext.AllClasses.Remove(cls);

    await _ScheduleContext.SaveChangesAsync();

    return Ok(new { message = "Class moved to history successfully", historyId = history.HistoryId });
}
    }
}