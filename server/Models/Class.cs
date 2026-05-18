using System.ComponentModel.DataAnnotations;
namespace MyWebApiProject.Models
{
public class Class
{
    [Key]  // Primary Key
    public Guid ClassID { get; set; }=Guid.NewGuid();

    [Required]
    public string Name { get; set; }="";
    // קשר N:M למורים
    // public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}
public class ClassDTO
    {
        public string? Name { get; set; }
    }
}