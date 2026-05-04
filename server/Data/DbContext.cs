
using Microsoft.EntityFrameworkCore;
using Seminary--Scedule.Models;

namespace Seminary--Scedule.Data
{
class DbContexct:DbContext
{
   
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }

        public DbSet<HoursBooked> HoursBookeds { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbContexct(DbContextOptions<DbContexct> options)
            : base(options)

            {
                
            }

            
    }
}
