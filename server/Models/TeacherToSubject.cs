using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class TeacherToSubject
    {
        [Key]
        public Guid TeacherToSubjectId { get; set; } = Guid.NewGuid();

        // ---------------- Teacher FK ----------------

        [ForeignKey(nameof(Teacher))]
        public Guid TeacherID { get; set; }

        public virtual Teacher? Teacher { get; set; }

        // ---------------- Subject FK ----------------

        [ForeignKey(nameof(Subject))]
        public Guid SubjectID { get; set; }

        public virtual Subject? Subject { get; set; }

        // ---------------- Class FK ----------------

        [ForeignKey(nameof(Class))]
        public Guid ClassID { get; set; }

        public virtual Class? Class { get; set; }
    }
     public class TeacherToSubjectDTO
    {
        public Guid TeacherID { get; set; }
        public string SubjectName { get; set; } = ""; // שם המקצוע
        public string ClassName { get; set; } = "";   // שם הכיתה
    }
}