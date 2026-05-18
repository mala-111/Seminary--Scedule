using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherToSubjectController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public TeacherToSubjectController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // POST: /manager/home/subjectToTeacher
        // שיוך מקצועות למורה
        [HttpPost("subjectToTeacher")]
        public async Task<ActionResult<TeacherToSubject>> AssignSubjectToTeacher(TeacherToSubject dto)
        {
            var entity = new TeacherToSubject
            {
                TeacherID = dto.TeacherID,
                SubjectID = dto.SubjectID,
                ClassID = dto.ClassID
            };

            _ScheduleContext.TeacherToSubjects.Add(entity);
            await _ScheduleContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllAssignments), new { id = entity.TeacherToSubjectId }, entity);
        }

        // GET: /manager/home/subjectToTeacher
        // צפיה בכל השיוכים
        [HttpGet("subjectToTeacher")]
        public async Task<ActionResult<IEnumerable<TeacherToSubject>>> GetAllAssignments()
        {
            return await _ScheduleContext.TeacherToSubjects.ToListAsync();
        }
    }
}