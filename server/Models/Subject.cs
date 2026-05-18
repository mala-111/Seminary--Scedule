using System.ComponentModel.DataAnnotations;
namespace MyWebApiProject.Models
{
public class Subject
{
    [Key]  // Primary Key
    public Guid SubjectID { get; set; }=Guid.NewGuid();

    [Required]
    public string Name { get; set; }="";

    // קשר N:M למורים
    // public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}

public class SubjectDTO
    {
     public string Name { get; set; }="";


    }
}