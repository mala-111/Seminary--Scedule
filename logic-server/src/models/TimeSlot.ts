export interface TimeSlot {
  day: number;        // 0 = ראשון
  hour: number;       // שעה במערכת (למשל 8, 9, 10...)

  isFree: boolean;

  teacherId?: string;
  classId?: string;
  subjectId?: string;
}