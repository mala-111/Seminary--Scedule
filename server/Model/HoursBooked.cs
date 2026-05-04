using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class HoursBooked
{
    [Key]  // Primary Key
    public int BookingID { get; set; }

    [ForeignKey("Teacher")]  // Foreign Key למורה
    public int TeacherID { get; set; }

    [Required]
    public string Day { get; set; }

    [Required]
    public TimeSpan HourStart { get; set; }

    [Required]
    public TimeSpan HourEnd { get; set; }

    public virtual Teacher Teacher { get; set; }
}
