using MyWebApiProject.Models;

namespace MyWebApiProject.Data
{
    public static class SeedData
    {
        public static void SeedSubjects(ScheduleContext context)
{
    var subjects = new List<Subject>
    {
        new Subject { Name = "פיזיקה", Category = "חול" },
        new Subject { Name = "כימיה", Category = "חול" },
        new Subject { Name = "ביולוגיה", Category = "חול" },
        new Subject { Name = "מדעים", Category = "חול" },
        new Subject { Name = "ספרות", Category = "חול" },
        new Subject { Name = "היסטוריה", Category = "חול" },
        new Subject { Name = "גאוגרפיה", Category = "חול" },
        new Subject { Name = "אמנות", Category = "חול" },
        new Subject { Name = "מוסיקה", Category = "חול" },
        new Subject { Name = "התעמלות", Category = "חול" },
        new Subject { Name = "מחשבים", Category = "חול" },
        new Subject { Name = "כלכלה", Category = "חול" },
        new Subject { Name = "מדעי החברה", Category = "חול" },
        new Subject { Name = "פסיכולוגיה", Category = "חול" },
        new Subject { Name = "מדעי הסביבה", Category = "חול" },
        new Subject { Name = "עיצוב גרפי", Category = "חול" },
        new Subject { Name = "רובוטיקה", Category = "חול" },
        new Subject { Name = "אזרחות", Category = "חול" },
        new Subject { Name = "תקשורת", Category = "חול" },
        new Subject { Name = "לשון והבעה", Category = "חול" },
        new Subject { Name = "תחביר", Category = "חול" },
        new Subject { Name = "דקדוק", Category = "הקבצות" }
    };

    foreach (var subject in subjects)
    {
        var existing = context.Subjects
            .FirstOrDefault(s => s.Name == subject.Name);

        if (existing == null)
        {
            context.Subjects.Add(subject);
        }
        else
        {
            existing.Category = subject.Category;
        }
    }

    context.SaveChanges();
}




         public static void SeedGrades(ScheduleContext context)
        {
            if (context.Grades.Any())
                return;

            var grades = new List<Class>
            {
                new Class { Name = "א" },
                new Class { Name = "ב" },
                new Class { Name = "ג" },
                new Class { Name = "ד" },
                new Class { Name = "ה" },
                new Class { Name = "ו" },
                
            };

            context.Grades.AddRange(grades);

            context.SaveChanges();
        }
    }
}