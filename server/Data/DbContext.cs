
using Microsoft.EntityFrameworkCore;
using SeminaryScedule.Models;

namespace SeminaryScedule.Data
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
