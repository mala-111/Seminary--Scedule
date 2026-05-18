using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
public class HoursBooked
{
    [Key]// Primary Key
    public Guid BookingID { get; set; }=Guid.NewGuid();

    [ForeignKey("Teacher")]  // Foreign Key למורה
    public Guid TeacherID { get; set; }

    [Required]
    public string Day { get; set; }="";

    [Required]
    public TimeSpan HourStart { get; set; }

    [Required]
    public TimeSpan HourEnd { get; set; }

    // public virtual Teacher? Teacher { get; set; }
}
public class HoursBookedDTO
    {
      public string Day { get; set; }="";
      public TimeSpan HourStart { get; set; }
      public TimeSpan HourEnd { get; set; }

    }
    }