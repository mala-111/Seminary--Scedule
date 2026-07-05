import { SchedulerState } from "../models/SchedulerState";
import { LessonDemand } from "../types/LessonDemand";

type ClassSubjectRequirement = {
  subjectID: string;
  allClassesID: string;
  weeklyHoursRequired: number;
};

export class LessonDemandBuilder {

  constructor(private state: SchedulerState) {}

  build(): LessonDemand[] {
    const demands: LessonDemand[] = [];

    console.log(
      "Requirements:",
      this.state.input.classSubjectRequirements.length
    );

    for (const req of this.state.input
      .classSubjectRequirements as ClassSubjectRequirement[]) {

      console.log("REQ FULL:", req);

      const subjectId = req.subjectID;
      const classId = req.allClassesID;

      console.log("subjectId:", subjectId);
      console.log("classId:", classId);

      const subject = this.state.getSubjectById(subjectId);

      console.log("Subject exists:", subject);

      if (!subject) continue;

      const remainingHours =
        this.state.getClassRemainingHours(classId, subjectId);

      console.log("remainingHours =", remainingHours);

      if (remainingHours <= 0) continue;

      const allTeachers = this.state.teachers;

      const scored = allTeachers
        .map(t => ({
          id: t.teacherID,
          score: this.scoreTeacher(t, subjectId, classId)
        }))
        .filter(t => t.score > 0)
        .sort((a, b) => b.score - a.score);

      const teacherCandidates = scored.map(s => s.id);

      console.log("teacherCandidates:", teacherCandidates);

      demands.push({
        classId,
        subjectId,
        remainingHours,
        teacherCandidates,
        category: subject.category,
        priority: this.getPriority(subject.category),
      });
    }

    return demands.sort((a, b) => b.priority - a.priority);
  }

  private getPriority(category: string): number {
    switch (category) {
      case "Grouping":
        return 100;
      case "Core":
        return 80;
      case "Homeroom":
        return 70;
      default:
        return 50;
    }
  }

  private scoreTeacher(
    teacher: any,
    subjectId: string,
    classId: string
  ): number {

    let score = 0;

    const links = this.state.input.teacherToSubject;

    for (const link of links) {

      if (link.TeacherID !== teacher.teacherID) continue;

      // התאמה מלאה
      if (link.SubjectID === subjectId && link.ClassID === classId) {
        score += 100;
      }

      // התאמת מקצוע בלבד
      if (link.SubjectID === subjectId) {
        score += 50;
      }
    }

    // בונוס על שעות פנויות
    score += this.state.getTeacherRemainingHours(teacher.teacherID);

    return score;
  }
}