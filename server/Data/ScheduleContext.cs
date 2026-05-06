
using Microsoft.EntityFrameworkCore;


namespace MyWebApiProject.Data
{
    using Models;
public class ScheduleContext:DbContext
{
   
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Schedule { get; set; }

        public DbSet<HoursBooked> EmployeeTypes { get; set; }

        public ScheduleContext(DbContextOptions<ScheduleContext> options)
            : base(options)

            {

            }
    }
}
