import { SchedulerState, TimeSlot } from "../models/SchedulerState";

export class SlotScoringEngine {
  constructor(private state: SchedulerState) {}

  evaluate(params: {
    slot: TimeSlot;
    teacherId: string;
    classId: string;
  }): number {

    const { slot, teacherId, classId } = params;

    // ❌ חסימה = פסילה מוחלטת
    if (this.state.isBlocked(slot.day, slot.hour)) {
      return -10000;
    }

    let score = 100;

    // ⏰ העדפת שעות מוקדמות
    score -= slot.hour * 4;

    // 📊 עומס כללי ביום
    const dayLoad = this.state.assignments.filter(
      a => a.day === slot.day
    ).length;
    score -= dayLoad * 10;

    // 👨‍🏫 עומס מורה ביום
    const teacherLoad = this.state.getTeacherDayLoad(teacherId, slot.day);
    score -= teacherLoad * 15;

    // 🏫 עומס כיתה ביום
    const classLoad = this.state.assignments.filter(
      a => a.classId === classId && a.day === slot.day
    ).length;
    score -= classLoad * 12;

    // 📉 איזון עומס יומי
    if (dayLoad >= 6) score -= 15;
    else if (dayLoad >= 4) score -= 7;

    return score;
  }
}