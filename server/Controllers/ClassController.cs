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

   public ClassController (ScheduleContext ScheduleContext)
   {
       _ScheduleContext = ScheduleContext;
   }

   [HttpGet]
   public async Task<ActionResult<IEnumerable<Class>>> GetShowScheduleClasses(int skip=0,int take = 10)
        {
            return await _ScheduleContext.Classes.Skip(skip).Take(take).ToListAsync();
        }

    [HttpPost]
        public async Task<ActionResult<Class>> CreateClass(ClassDTO cl)
        {
            if (string.IsNullOrWhiteSpace(cl.Name))
            {
                return BadRequest("Disc name is required.");
            }
            if (
                _ScheduleContext.Classes.Any(a =>
                    a.Name != null && a.Name.Trim().ToUpper() == cl.Name.Trim().ToUpper()
                )
            )
            {
                return Conflict("A disc with the same name already exists.");
            }
            var classEntity = new Class
            {
               
                Name = cl.Name.Trim()
                
                
               
            };
            _ScheduleContext.Classes.Add(classEntity);
            await _ScheduleContext.SaveChangesAsync();

            return CreatedAtAction(nameof( GetShowScheduleClasses), new { id = classEntity.ClassID }, classEntity);
        }
}

}
