using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class ClassSubjectRequirement
    {
        [Key]
        public Guid ClassSubjectRequirementId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(AllClasses))]
        public Guid AllClassesID { get; set; }
        public AllClasses? AllClasses { get; set; }

        [Required]
        [ForeignKey(nameof(Subject))]
        public Guid SubjectID { get; set; }
        public Subject? Subject { get; set; }

        [Required]
        public int WeeklyHoursRequired { get; set; }
    }

    public class ClassSubjectRequirementDTO
    {
        public Guid AllClassesID { get; set; }
        public Guid SubjectID { get; set; }
        public int WeeklyHoursRequired { get; set; }
    }
}