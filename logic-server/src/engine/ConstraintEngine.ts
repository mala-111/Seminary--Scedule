import { SchedulerState } from "../models/SchedulerState";
import { Teacher } from "../types/Teacher";
import { Subject } from "../types/Subject";
import { AllClasses } from "../types/allClasses";

export interface ConstraintResult {
  ok: boolean;
  reason?: string;
}

export class ConstraintEngine {
  constructor(private state: SchedulerState) {}

  // =========================
  // 🚀 MAIN CHECK
  // =========================
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

    if (!this.state.isSlotFree(day, hour)) {
      return { ok: false, reason: "slot taken" };
    }

    if (!this.isTeacherFree(teacher, day, hour)) {
      return { ok: false, reason: "teacher busy" };
    }

    if (!this.isQualified(teacher, subject)) {
      return { ok: false, reason: "not qualified" };
    }

    if (!this.isAllowedClass(teacher, classItem)) {
      return { ok: false, reason: "class blocked" };
    }

    if (!this.canWorkMore(teacher)) {
      return { ok: false, reason: "no hours left" };
    }

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
  private isQualified(teacher: Teacher, subject: Subject): boolean {
    return (this.state.input.teacherToSubject || []).some(t =>
      t.teacherID === teacher.teacherID &&
      t.subjectID === subject.subjectID
    );
  }

  // =========================
  // 🚫 CLASS RESTRICTION
  // =========================
  private isAllowedClass(teacher: Teacher, classItem: AllClasses): boolean {
    return (this.state.input.teacherToSubject || []).some(t =>
      t.teacherID === teacher.teacherID &&
      t.className === classItem.className
    );
  }

  // =========================
  // ⏱ HOURS LIMIT
  // =========================
  private canWorkMore(teacher: Teacher): boolean {
    return this.state.getTeacherRemainingHours(teacher.teacherID) > 0;
  }
}