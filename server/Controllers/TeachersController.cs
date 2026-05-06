using Microsoft.AspNetCore.Mvc;
using MyWebApiProject.Data;

namespace MyWebApiProject.Controllers{

[ApiController]
[Route("[controller]")]
public class TeachersController : ControllerBase
{
   private readonly ScheduleContext _ScheduleContext;

   public TeachersController (ScheduleContext ScheduleContext)
   {
       _ScheduleContext = ScheduleContext;
   }

   [HttpGet]
   public ActionResult Get(int take = 10, int skip = 0)
   {
       return Ok(_ScheduleContext.Teachers.OrderBy(t => t.Name).Skip(skip).Take(take));
   }
}
}