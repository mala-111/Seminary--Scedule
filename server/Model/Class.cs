using System.ComponentModel.DataAnnotations;
public class Class
{
    [Key]  // Primary Key
    public int ClassID { get; set; }

    [Required]
    public string Name { get; set; }

    // קשר N:M למורים
    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}
