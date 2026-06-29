import { SchedulerState } from "../models/SchedulerState";
import { Teacher } from "../types/Teacher";
import { Subject } from "../types/Subject";
import { AllClasses } from "../types/allClasses";

export interface ConstraintResult {
  ok: boolean;
  reason?: string;
}

export class ConstraintEngine {
  constructor(private state: SchedulerState) { }

  // =========================
  // 🚀 MAIN CHECK
  // =========================
  private canTeach(
    teacher: Teacher,
    subject: Subject,
    classItem: AllClasses
  ): boolean {
    if (process.env.DEBUG_CONSTRAINTS) {

      console.log("teacherToSubject sample:", this.state.input.teacherToSubject.slice(0, 5));
      console.log("CAN_TEACH_CHECK", {
        teacher: teacher.teacherID,
        subject: subject.subjectID,
        class: classItem.allClassesID,
        rows: this.state.input.teacherToSubject.length
      });
    }
    if (subject.subjectID === "00000000-0000-0000-0000-000000000001") {
  return true;
}
    const key = `${teacher.teacherID}_${subject.subjectID}_${classItem.allClassesID}`;

    return this.state.input.teacherToSubject.some(t =>
      `${t.teacherID}_${t.subjectID}_${t.classID}` === key
    );
  }


  canPlace(
    teacher: Teacher,
    classItem: AllClasses,
    subject: Subject,
    day: number,
    hour: number
  ): ConstraintResult {


    const teacherId = teacher.teacherID;
    const classId = classItem.allClassesID;
    const subjectId = subject.subjectID;

    console.log("CHECK:", teacherId, classId, day, hour);

    if (!teacherId || !classId || !subjectId) {
      return { ok: false, reason: "missing data (undefined ids)" };
    }
    if (!this.state.isSlotFree(day, hour)) return { ok: false, reason: "slot taken" };

    if (this.state.isGroupLocked([classId], day, hour)) {
      return { ok: false, reason: "group conflict" };
    }

    if (!this.isTeacherFree(teacher, day, hour)) return { ok: false, reason: "teacher busy" };

    if (!this.state.isClassFree(classItem.allClassesID!, day, hour)) return { ok: false, reason: "class busy" };

    if (!this.canWorkMore(teacher)) return { ok: false, reason: "no hours left" };

    if (!this.canTeach(teacher, subject, classItem)) return { ok: false, reason: "not allowed" };

    return { ok: true };
  }

  // =========================
  // 👩‍🏫 TEACHER AVAILABILITY
  // =========================
  private isTeacherFree(teacher: Teacher, day: number, hour: number): boolean {
    const booked = this.state.input.hoursBooked ?? [];

    return !booked.some(b =>
      b.teacherID === teacher.teacherID &&
      b.day === day &&
      hour >= b.hourStart &&
      hour < b.hourEnd
    );
  }

  // =========================
  // 📚 QUALIFICATION
  // =========================


  // =========================
  // 🚫 CLASS RESTRICTION
  // =========================



  // =========================
  // ⏱ HOURS LIMIT
  // =========================
  private canWorkMore(teacher: Teacher): boolean {
    return this.state.getTeacherRemainingHours(teacher.teacherID) > 0;
  }
}