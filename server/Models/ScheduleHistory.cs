using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class ScheduleHistory {
        [Key]
        public Guid HistoryId{get;set;}=Guid.NewGuid();
         public Guid ScheduleId {get; set;}

        // [ForeignKey("Teacher")]
        public Guid TeacherID { get; set; }

        // [ForeignKey("Subject")]
        public Guid SubjectID { get; set; }

        // [ForeignKey("AllClasses")]

        public Guid AllClassesID { get; set; }

        // public Teacher teacher {get; set;}
        [Required]
        public string Day  {get;  set;}="";
        [Required]

        public string Hour  {get; set; }="";

         public DateTime UpdateHistory{get; set;}

    }

    
}