    using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyWebApiProject.Models
{
public class Employee
{
     [Key]// Primary Key
    public Guid EmployeeId{get;set;}=Guid.NewGuid();
     [Required]
    public string Name { get; set; }="";
     [Required]
    public string EmployeeCode { get; set; }="";     
}
public class EmployeeDTO
    {
public string Name { get; set; }="";
    public string EmployeeCode { get; set; }="";    }

}
    
   