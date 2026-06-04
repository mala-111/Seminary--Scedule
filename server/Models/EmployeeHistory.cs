    using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class EmployeeHistory
{
     [Key]// Primary Key
    public Guid HistoryId{get;set;}=Guid.NewGuid();
    public Guid EmployeeId { get; set; }=Guid.NewGuid();

    
    public string Name { get; set; }="";
    public string EmployeeCode { get; set; }="";     
   public DateTime UpdateHistory{get; set;}

}

}
    
   