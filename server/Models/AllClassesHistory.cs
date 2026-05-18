using System.ComponentModel.DataAnnotations;
namespace MyWebApiProject.Models
{
public class AllClassesHistory
{
    [Key]  // Primary Key
    public Guid HistoryId{get;set;}=Guid.NewGuid();
    public Guid AllClassesID { get; set; }

    [Required]
    public string ClassName { get; set; }="";
    public DateTime UpdateHistory{get; set;}
    // קשר N:M למורים
    // public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();

}

}