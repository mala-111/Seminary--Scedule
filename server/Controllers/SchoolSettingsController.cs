using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolSettingsController : ControllerBase
    {
        private readonly ScheduleContext _context;

        public SchoolSettingsController(ScheduleContext context)
        {
            _context = context;
        }

        // GET: /api/schoolsettings
        [HttpGet]
        public async Task<ActionResult<SchoolSettings>> Get()
        {
            var settings = await _context.SchoolSettings.FirstOrDefaultAsync();

            if (settings == null)
                return NotFound("School settings not defined");

            return Ok(settings);
        }

        // POST: /api/schoolsettings
        [HttpPost]
        public async Task<IActionResult> Save(SchoolSettingsDTO dto)
        {
            var existing = await _context.SchoolSettings.FirstOrDefaultAsync();

            if (existing == null)
            {
                var entity = new SchoolSettings
                {
                    StartHour = dto.StartHour,
                    EndHour = dto.EndHour,
                    WorkingDaysPerWeek = dto.WorkingDaysPerWeek,
                    MinLessonsPerDay = dto.MinLessonsPerDay,
                    MaxConsecutiveLessons = dto.MaxConsecutiveLessons,
                    PatrolHoursRatio = dto.PatrolHoursRatio
                };

                _context.SchoolSettings.Add(entity);
            }
            else
            {
                existing.StartHour = dto.StartHour;
                existing.EndHour = dto.EndHour;
                existing.WorkingDaysPerWeek = dto.WorkingDaysPerWeek;
                existing.MinLessonsPerDay = dto.MinLessonsPerDay;
                existing.MaxConsecutiveLessons = dto.MaxConsecutiveLessons;
                existing.PatrolHoursRatio = dto.PatrolHoursRatio;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "School settings saved successfully" });
        }

        // PUT: reset settings
        [HttpPut("reset")]
        public async Task<IActionResult> Reset()
        {
            var settings = await _context.SchoolSettings.FirstOrDefaultAsync();

            if (settings != null)
            {
                _context.SchoolSettings.Remove(settings);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Settings reset" });
        }
    }
}