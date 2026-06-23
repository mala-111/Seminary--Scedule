using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassSubjectRequirementController : ControllerBase
    {
        private readonly ScheduleContext _context;

        public ClassSubjectRequirementController(ScheduleContext context)
        {
            _context = context;
        }

        // GET: all requirements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassSubjectRequirement>>> GetAll()
        {
            return await _context.ClassSubjectRequirements
                .Include(x => x.AllClasses)
                .Include(x => x.Subject)
                .ToListAsync();
        }

        // GET by class
        [HttpGet("byClass/{classId}")]
        public async Task<ActionResult<IEnumerable<ClassSubjectRequirement>>> GetByClass(Guid classId)
        {
            var list = await _context.ClassSubjectRequirements
                .Where(x => x.AllClassesID == classId)
                .Include(x => x.Subject)
                .ToListAsync();

            return Ok(list);
        }

        // POST create requirement
        [HttpPost]
        public async Task<IActionResult> Create(ClassSubjectRequirementDTO dto)
        {
            var entity = new ClassSubjectRequirement
            {
                AllClassesID = dto.AllClassesID,
                SubjectID = dto.SubjectID,
                WeeklyHoursRequired = dto.WeeklyHoursRequired
            };

            _context.ClassSubjectRequirements.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = entity.ClassSubjectRequirementId }, entity);
        }

        // PUT update requirement
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, ClassSubjectRequirementDTO dto)
        {
            var entity = await _context.ClassSubjectRequirements.FindAsync(id);

            if (entity == null)
                return NotFound();

            entity.AllClassesID = dto.AllClassesID;
            entity.SubjectID = dto.SubjectID;
            entity.WeeklyHoursRequired = dto.WeeklyHoursRequired;

            await _context.SaveChangesAsync();

            return Ok(entity);
        }

        // DELETE requirement
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.ClassSubjectRequirements.FindAsync(id);

            if (entity == null)
                return NotFound();

            _context.ClassSubjectRequirements.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Requirement deleted" });
        }
    }
}