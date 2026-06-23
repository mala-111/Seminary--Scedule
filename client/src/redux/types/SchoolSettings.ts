export interface SchoolSettings {
  schoolSettingsId?: string;

  startHour: number;
  endHour: number;
  workingDaysPerWeek: number;
  minLessonsPerDay: number;
  maxConsecutiveLessons: number;
  patrolHoursRatio: number;
}