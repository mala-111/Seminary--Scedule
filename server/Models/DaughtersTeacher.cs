using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class DaughtersTeacher
{
    [Key]  // Primary Key
    public Guid ClassDaughtersTeacherID { get; set; }=Guid.NewGuid();

    [ForeignKey("Teacher")]  // Foreign Key למורה
    public Guid TeacherID { get; set; }

    [Required]
    public string ClassName { get; set; }="";
    public Teacher? Teacher { get; set; }
}
public class DaughtersTeacherDTO
    {
        public Guid TeacherID { get; set; }
        public string ClassName { get; set; }="";

    }
}