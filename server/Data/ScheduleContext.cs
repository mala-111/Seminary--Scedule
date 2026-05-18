using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Models;

namespace MyWebApiProject.Data
{
    public class ScheduleContext : DbContext
    {
        public ScheduleContext(DbContextOptions<ScheduleContext> options) : base(options) { }

        // כאן נרשום את כל הטבלאות
        public DbSet<Class> Classes { get; set; }
        public DbSet<AllClasses> AllClasses { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<HoursBooked> HoursBooked { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<TeacherToSubject> TeacherToSubjects { get; set; }




        public DbSet<ClassHistory> ClassesHistory { get; set; }
        public DbSet<AllClassesHistory> AllClassesHistory { get; set; }
        public DbSet<TeacherHistory> TeachersHistory { get; set; }
        public DbSet<SubjectHistory> SubjectsHistory { get; set; }
        public DbSet<HoursBookedHistory> HoursBookedHistory { get; set; }
        public DbSet<ScheduleHistory> SchedulesHistory { get; set; }
        public DbSet<TeacherToSubjectHistory> TeacherToSubjectsHistory { get; set; }
    }
}