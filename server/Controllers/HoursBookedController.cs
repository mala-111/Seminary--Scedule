using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using MyWebApiProject.Models;

namespace MyWebApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HoursBookedController : ControllerBase
    {
        private readonly ScheduleContext _ScheduleContext;

        public HoursBookedController(ScheduleContext ScheduleContext)
        {
            _ScheduleContext = ScheduleContext;
        }

        // POST: /employee/home/fill/weeklyHoursOccupied
        // מילוי מספר שעות תפוסות למורה
        [HttpPost("fill/weeklyHoursOccupied")]
        public async Task<ActionResult<HoursBooked>> BookHours(HoursBookedDTO dto)
        {
            var booked = new HoursBooked
            {
                Day = dto.Day,
                HourStart = dto.HourStart,
                HourEnd = dto.HourEnd
            };

            _ScheduleContext.HoursBooked.Add(booked);
            await _ScheduleContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllBookedHours), new { id = booked.BookingID }, booked);
        }

        // GET: /employee/home/showSchedule/allPersonal
        // צפיה בשעות תפוסות של המורה
        [HttpGet("showSchedule/allPersonal/{teacherId}")]
        public async Task<ActionResult<IEnumerable<HoursBooked>>> GetAllBookedHours(Guid teacherId)
        {
            return await _ScheduleContext.HoursBooked
                .Where(h => h.TeacherID == teacherId)
                .ToListAsync();
        }
    }
}