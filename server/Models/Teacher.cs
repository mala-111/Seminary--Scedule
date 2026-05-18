
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class Teacher
{
    [Key]  // Primary Key
    public Guid TeacherID { get; set; }=Guid.NewGuid();

    [Required]
   // [Index(IsUnique = true)]
    public string EmployeeCode { get; set; } = "" ; // קוד עובד ייחודי

    [Required]
    public string Name { get; set; }="";

    public int WeeklyHours { get; set; }
    public string PreferredDayOff { get; set; }="";
    public bool IsClassTeacher { get; set; }
    public bool IsGroupingTeacher { get; set; }


    // קשרים רבים-לרבים
   // public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
   // public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

    // קשר 1:N
    // public virtual ICollection<HoursBooked> BookedHours { get; set; } = new List<HoursBooked>();

    public Teacher(){

    }
}

public class TeacherDTO
    {
     public string EmployeeCode { get; set; } = "" ; // קוד עובד ייחודי

    
    public string Name { get; set; }="";

    public int WeeklyHours { get; set; }
    public string PreferredDayOff { get; set; }="";
    public bool IsClassTeacher { get; set; }
    public bool IsGroupingTeacher { get; set; }

    }
}
