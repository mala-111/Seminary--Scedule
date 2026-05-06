using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class TeacherToSubject{
        [Key]
         public Guid TeacherToSubjectId {get; set;}

        [ForeignKey("Teacher")]
        public Guid TeacherID { get; set; }

        [ForeignKey("Subject")]
        public Guid SubjectID { get; set; }

        [ForeignKey("Class")]
        public Guid ClassID { get; set; }

    }
}