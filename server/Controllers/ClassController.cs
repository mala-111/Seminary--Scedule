using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public ClassController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // GET: /manager/home/showSchedule/classes
        // הצגת מערכת השעות הכללית לפי כיתות
        [HttpGet("showSchedule/classes")]
        public async Task<ActionResult<IEnumerable<Class>>> GetShowScheduleClasses(int skip = 0, int take = 10)
        {
            return await _ScheduleContext.Classes.Skip(skip).Take(take).ToListAsync();
        }

        // POST: /manager/home/newClass
        // הכנסת כיתה חדשה למערכת
        [HttpPost("newClass")]
        public async Task<ActionResult<Class>> CreateClass(ClassDTO cl)
        {
            if (string.IsNullOrWhiteSpace(cl.Name))
            {
                return BadRequest("שם הכיתה הוא חובה.");
            }

            if (_ScheduleContext.Classes.Any(a => a.Name != null && a.Name.Trim().ToUpper() == cl.Name.Trim().ToUpper()))
            {
                return Conflict("כיתה עם שם זה כבר קיימת.");
            }

            var classEntity = new Class
            {
                Name = cl.Name.Trim()
            };

            _ScheduleContext.Classes.Add(classEntity);
            await _ScheduleContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShowScheduleClasses), new { id = classEntity.ClassID }, classEntity);
        }

        // DELETE: /manager/home/delete/class
        // מחיקת כיתה
        [HttpDelete("delete/class/{id}")]
        public async Task<IActionResult> DeleteClass(Guid id)
        {
            var classEntity = await _ScheduleContext.Classes.FindAsync(id);
            if (classEntity == null)
            {
                return NotFound("כיתה לא נמצאה.");
            }

            _ScheduleContext.Classes.Remove(classEntity);
            await _ScheduleContext.SaveChangesAsync();

            return NoContent();
        }
    }
}