
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class TeacherHistory
{
    [Key]  // Primary Key
    public Guid HistoryId{get;set;}=Guid.NewGuid();
    public Guid TeacherID { get; set; }

    [Required]
   // [Index(IsUnique = true)]
    public string EmployeeCode { get; set; } = "" ; // קוד עובד ייחודי

    [Required]
    public string Name { get; set; }="";

    public int WeeklyHours { get; set; }

    public string PreferredDayOffA{ get; set; }="";

    public string PreferredDayOffB{ get; set; }="";
    public string PreferredDayOffC{ get; set; }="";
    public bool IsClassTeacher { get; set; }
    public bool IsGroupingTeacher { get; set; }

     public DateTime UpdateHistory{get; set;}

     // NAVIGATION
        public Teacher? Teacher { get; set; }

        public Subject? Subject { get; set; }

        public Class? Class { get; set; }
    // קשרים רבים-לרבים
   // public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
   // public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

    // קשר 1:N
    // public virtual ICollection<HoursBooked> BookedHours { get; set; } = new List<HoursBooked>();

    public TeacherHistory(){

    }
}


}
