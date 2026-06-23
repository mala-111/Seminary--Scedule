using System.ComponentModel.DataAnnotations;

namespace MyWebApiProject.Models
{
    public class SchoolSettings
    {
        [Key]
        public Guid SchoolSettingsId { get; set; } = Guid.NewGuid();

        [Required]
        public int StartHour { get; set; }

        [Required]
        public int EndHour { get; set; }

        [Required]
        public int WorkingDaysPerWeek { get; set; }

        [Required]
        public int MinLessonsPerDay { get; set; }

        public int MaxConsecutiveLessons { get; set; } = 4;

        public int PatrolHoursRatio { get; set; } = 4; // רבע שעות פטרול
    }

    public class SchoolSettingsDTO
    {
        public int StartHour { get; set; }
        public int EndHour { get; set; }
        public int WorkingDaysPerWeek { get; set; }
        public int MinLessonsPerDay { get; set; }
        public int MaxConsecutiveLessons { get; set; }
        public int PatrolHoursRatio { get; set; }
    }
}