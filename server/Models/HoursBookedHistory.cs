using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
public class HoursBookedHistory
{
    [Key]// Primary Key
    public Guid HistoryId{get;set;}=Guid.NewGuid();
    public Guid BookingID { get; set; }
    // [ForeignKey("Teacher")]  // Foreign Key למורה
    public Guid TeacherID { get; set; }

    [Required]
    public string Day { get; set; }="";

    [Required]
    public TimeSpan HourStart { get; set; }

    [Required]
    public TimeSpan HourEnd { get; set; }

    public string Reason { get; set; }="";
     public DateTime UpdateHistory{get; set;}
    // public virtual Teacher? Teacher { get; set; }
}

    }