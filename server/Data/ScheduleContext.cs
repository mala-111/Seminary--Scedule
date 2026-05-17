
using Microsoft.EntityFrameworkCore;


namespace MyWebApiProject.Data
{
    using Models;
public class ScheduleContext:DbContext
{
   
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }

        public DbSet<HoursBooked> HoursBookeds { get; set; }
        public DbSet<Subject> Subjects { get; set; }

        public DbSet<TeacherToSubject> TeacherToSubjects { get; set; }


        public ScheduleContext(DbContextOptions<ScheduleContext> options)
            : base(options)

            {

            }
    }
}
