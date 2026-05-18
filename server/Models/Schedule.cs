using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class Schedule {
        [Key]
         public Guid ScheduleId {get; set;}=Guid.NewGuid();

        [ForeignKey("Teacher")]
        public Guid TeacherID { get; set; }

        [ForeignKey("Subject")]
        public Guid SubjectID { get; set; }

        [ForeignKey("AllClasses")]

        public Guid AllClassesID { get; set; }

        // public Teacher teacher {get; set;}
        public string SubjectDTOay  {get;  set;}="";

         [Required]
        public string Day  {get;  set;}="";
        [Required]

        public string Hour  {get; set; }="";


    }

    public class ScheduleDTO
    {
      public string Day  {get;  set;}

        public string Hour  {get; set; }

    }
}