using System.ComponentModel.DataAnnotations;
namespace MyWebApiProject.Models
{
public class AllClasses
{
    [Key]  // Primary Key
    public Guid AllClassesID { get; set; }=Guid.NewGuid();

    [Required]
    public string ClassName { get; set; }="";
    // קשר N:M למורים
    // public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}
public class AllClassesDTO
    {
        public string? Name { get; set; }
    }
}