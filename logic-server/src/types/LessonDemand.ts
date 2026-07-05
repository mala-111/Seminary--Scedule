export interface LessonDemand {
  classId: string;
  subjectId: string;
  remainingHours: number;

  teacherCandidates: string[];
  category: string;

  priority: number;
}