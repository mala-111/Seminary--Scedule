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
  // 🚀 MAIN ENTRY
  // =========================
  canPlace(
    teacher: Teacher,
    classItem: AllClasses,
    subject: Subject,
    day: number,
    hour: number
  ): ConstraintResult {

    if (!teacher || !classItem || !subject) {
      return { ok: false, reason: "missing entity" };
    }

    if (this.state.isBlocked(day, hour)) {
      return { ok: false, reason: "slot blocked" };
    }

    // if (!this.state.isSlotFree(day, hour)) {
    //   return { ok: false, reason: "slot already taken" };
    // }

    if (this.state.isSlotTaken(day, hour)) {
      return { ok: false, reason: "slot taken" };
    }

    if (!this.isTeacherAvailable(teacher, day, hour)) {
      return { ok: false, reason: "teacher unavailable" };
    }

    if (!this.isQualified(teacher, subject)) {
      return { ok: false, reason: "not qualified" };
    }

    if (!this.isAllowedClass(teacher, classItem)) {
      return { ok: false, reason: "teacher not allowed" };
    }

    if (!this.hasHoursLeft(teacher)) {
      return { ok: false, reason: "no hours left" };
    }

    if (this.state.isDaughtersTeacher(teacher.teacherID, classItem.allClassesID)) {
      return { ok: false, reason: "daughters restriction" };
    }

    return { ok: true };
  }

  // =========================
  // 👩‍🏫 HOURS BOOKED
  // =========================
  private isTeacherAvailable(teacher: Teacher, day: number, hour: number): boolean {
    const dayName = this.mapDay(day);

    return !(this.state.input.hoursBooked ?? []).some(b =>
      b.teacherID === teacher.teacherID &&
      b.Day === dayName &&
      hour >= this.toHour(b.HourStart) &&
      hour < this.toHour(b.HourEnd)
    );
  }

  private toHour(t: any): number {
    if (typeof t === "number") return t;
    return Number(String(t).split(":")[0]);
  }

  private mapDay(day: number): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    return days[day] ?? "Unknown";
  }

  // =========================
  // 📚 QUALIFICATION
  // =========================
  private isQualified(teacher: Teacher, subject: Subject): boolean {
    return (this.state.input.teacherToSubject ?? []).some(t =>
      t.teacherID === teacher.teacherID &&
      t.subjectID === subject.subjectID
    );
  }

  // =========================
  // 🏫 CLASS RULE
  // =========================
  private isAllowedClass(teacher: Teacher, classItem: AllClasses): boolean {
    return (this.state.input.teacherToSubject ?? []).some(t =>
      t.teacherID === teacher.teacherID &&
      t.allClassesID === classItem.allClassesID
    );
  }


  // =========================
  // ⏱ HOURS
  // =========================
  private hasHoursLeft(teacher: Teacher): boolean {
    return this.state.getTeacherRemainingHours(teacher.teacherID) > 0;
  }
}