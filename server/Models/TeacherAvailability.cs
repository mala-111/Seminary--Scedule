using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebApiProject.Models
{
    public class TeacherAvailability
    {
        [Key]
        public Guid TeacherAvailabilityId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(Teacher))]
        public Guid TeacherID { get; set; }
        public Teacher? Teacher { get; set; }

        [Required]
        public int EarliestHour { get; set; }

        [Required]
        public int LatestHour { get; set; }
    }

    public class TeacherAvailabilityDTO
    {
        public Guid TeacherID { get; set; }
        public int EarliestHour { get; set; }
        public int LatestHour { get; set; }
    }
}