    using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class DaughtersTeacherHistory
{
     [Key]// Primary Key
    public Guid HistoryId{get;set;}=Guid.NewGuid();
    public Guid ClassDaughtersTeacherID { get; set; }=Guid.NewGuid();

    
    public Guid TeacherID { get; set; }

    public Guid AllClassesID { get; set; }
    public string ClassName { get; set; }="";
     public DateTime UpdateHistory{get; set;}
     
}

}
    
   