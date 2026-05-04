
using Microsoft.EntityFrameworkCore;
using Seminary--Scedule.Models;

namespace Seminary--Scedule.Data
{
class DbContexct:DbContext
{
   
        public DbSet<Teacher> Employees { get; set; }
        public DbSet<Class> Schedule { get; set; }

        public DbSet<HoursBooked> EmployeeTypes { get; set; }

        public DbContexct(DbContextOptions<DbContexct> options)
            : base(options)

            {

            }
    }
}
