import { SchedulerState, Assignment } from "../models/SchedulerState";

export class BalanceEngine {
  constructor(private state: SchedulerState) {}

  run() {
    const teachers = this.state.teachers;

    for (const teacher of teachers) {
      const lessons = this.getTeacherLessons(teacher.teacherID);

      if (this.hasTooManyConsecutive(lessons, 3)) {
        this.fixConsecutive(teacher.teacherID, lessons);
      }

      if (this.isDayOverloaded(lessons)) {
        this.redistributeDay(teacher.teacherID, lessons);
      }
    }
  }

  // =========================
  // 📦 LOAD LESSONS
  // =========================
  private getTeacherLessons(teacherId: string): Assignment[] {
    return this.state.assignments
      .filter(a => a.teacherId === teacherId)
      .sort((a, b) => a.day - b.day || a.hour - b.hour);
  }

  // =========================
  // 🔗 CONSECUTIVE CHECK
  // =========================
  private hasTooManyConsecutive(lessons: Assignment[], max: number): boolean {
    let count = 1;

    for (let i = 1; i < lessons.length; i++) {
      const prev = lessons[i - 1];
      const curr = lessons[i];

      const sameDay = curr.day === prev.day;
      const consecutiveHour = curr.hour === prev.hour + 1;

      if (sameDay && consecutiveHour) {
        count++;
        if (count > max) return true;
      } else {
        count = 1;
      }
    }

    return false;
  }

  // =========================
  // 🔧 FIX CONSECUTIVE
  // =========================
  private fixConsecutive(teacherId: string, lessons: Assignment[]) {
    for (let i = 1; i < lessons.length; i++) {
      const prev = lessons[i - 1];
      const curr = lessons[i];

      const isConsecutive =
        curr.day === prev.day &&
        curr.hour === prev.hour + 1;

      if (!isConsecutive) continue;

      const alternative = this.state.getFreeSlots().find(slot =>
        !this.state.isSlotTaken(slot.day, slot.hour) &&
        !this.state.isBlocked(slot.day, slot.hour)
      );

      if (!alternative) continue;

      this.state.removeAssignment(curr);

      this.state.addAssignment({
        teacherId: curr.teacherId,
        classId: curr.classId,
        subjectId: curr.subjectId,
        day: alternative.day,
        hour: alternative.hour,
      });
    }
  }

  // =========================
  // 📊 DAY OVERLOAD
  // =========================
  private isDayOverloaded(lessons: Assignment[]): boolean {
    const byDay = new Map<number, number>();

    for (const l of lessons) {
      byDay.set(l.day, (byDay.get(l.day) ?? 0) + 1);
    }

    return Array.from(byDay.values()).some(v => v >= 6);
  }


  private applyFreeDay(state) {
  for (const teacher of state.teachers) {
    const preferred = teacher.freeDayPriority;

    if (state.canShiftToDay(teacher, preferred.A)) continue;
    if (state.canShiftToDay(teacher, preferred.B)) continue;
    state.shiftTo(preferred.C);
  }
}
  // =========================
  // 🔄 REDISTRIBUTION
  // =========================
  private redistributeDay(teacherId: string, lessons: Assignment[]) {
    const byDay = new Map<number, Assignment[]>();

    for (const l of lessons) {
      if (!byDay.has(l.day)) byDay.set(l.day, []);
      byDay.get(l.day)!.push(l);
    }

    for (const [day, list] of byDay.entries()) {
      if (list.length < 6) continue;

      const lessonToMove = list[list.length - 1];

      const alternative = this.state.getFreeSlots().find(slot =>
        !this.state.isSlotTaken(slot.day, slot.hour) &&
        !this.state.isBlocked(slot.day, slot.hour)
      );

      if (!alternative) continue;

      this.state.removeAssignment(lessonToMove);

      this.state.addAssignment({
        teacherId: lessonToMove.teacherId,
        classId: lessonToMove.classId,
        subjectId: lessonToMove.subjectId,
        day: alternative.day,
        hour: alternative.hour,
      });

      break;
    }
  }
}