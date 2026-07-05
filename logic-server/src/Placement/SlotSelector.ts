import { SchedulerState, TimeSlot } from "../models/SchedulerState";
import { AllClasses } from "../types/allClasses";
import { LessonDemand } from "../types/LessonDemand";
import { SlotScoringEngine } from "../engine/SlotScoringEngine";



export class SlotSelector {
  constructor(private state: SchedulerState) {
    this.scoring = new SlotScoringEngine(state);
  }
  private scoring: SlotScoringEngine;




  // =========================
  // 🎯 GROUP SLOT (נשאר)
  // =========================
  findBestSlotForGroup(
    classes: AllClasses[],
    teacherId: string
  ): TimeSlot | null {

    const freeSlots = this.state.getFreeSlots();
    if (!freeSlots.length) return null;

    const validClasses = classes.filter(c => !!c.allClassesID);
    if (!validClasses.length) return null;

    let bestSlot: TimeSlot | null = null;
    let bestScore = -Infinity;

    const classIds = validClasses.map(c => c.allClassesID!);

    for (const slot of freeSlots) {
      const { day, hour } = slot;

      const allFree = validClasses.every(c =>
        this.state.isClassFree(c.allClassesID!, day, hour)
      );

      if (!allFree) continue;
      if (this.state.isBlocked(day, hour)) continue;
      if (this.state.isGroupLocked(classIds, day, hour)) continue;

      const score = this.scoring.evaluate({
        slot,
        teacherId,
        classId: classIds[0]
      });

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  // =========================
  // 🎯 REGULAR SLOT (ישן, נשאר)
  // =========================
  findBestSlot(): TimeSlot | null {
    const freeSlots = this.state.getFreeSlots();
    if (!freeSlots.length) return null;

    let bestSlot: TimeSlot | null = null;
    let bestScore = -Infinity;

    for (const slot of freeSlots) {
      const { day, hour } = slot;

      if (this.state.isSlotTaken(day, hour)) continue;

      const score = this.scoreSlot(slot);

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  // =========================
  // 🚀 NEW: Demand-aware Slot
  // =========================
  findBestSlotForDemand(
    demand: LessonDemand,
    teacher: any
  ): TimeSlot | null {
    const freeSlots = this.state.getFreeSlots();
    if (!freeSlots.length) return null;

    let bestSlot: TimeSlot | null = null;
    let bestScore = -Infinity;

    for (const slot of freeSlots) {
      const { day, hour } = slot;

      if (!this.state.isClassFree(demand.classId, day, hour)) continue;

      let score = this.scoreSlot(slot);

      // =========================
      // 👩‍🏫 Teacher constraints
      // =========================

      const isBlocked = this.state.input.hoursBooked.some(
        b => b.teacherID === teacher.teacherID && Number(b.day) === day
      );

      if (isBlocked) score -= 200;

      const teacherDailyLoad = this.state.assignments.filter(
        a => a.teacherId === teacher.teacherID && a.day === day
      ).length;

      score -= teacherDailyLoad * 15;

      // =========================
      // 🧠 Demand awareness
      // =========================

      if (demand.category === "Grouping") {
        if (hour < 2 || hour > 6) score -= 80;
      }

      if (demand.category === "Core") {
        score += 10;
      }

      // =========================
      // 📅 Teacher preference
      // =========================

      if (String(day) === teacher.preferredDayOffA) score -= 120;
      if (String(day) === teacher.preferredDayOffB) score -= 60;
      if (String(day) === teacher.preferredDayOffC) score -= 30;

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  // =========================
  // 📊 BASE SCORING (נקי)
  // =========================
  private scoreSlot(slot: TimeSlot): number {
    let score = 100;

    score -= slot.hour * 5;

    const dayLoad = this.getDayLoad(slot.day);
    score -= dayLoad * 10;

    const distributionPenalty = this.getDayDistributionPenalty(slot.day);
    score -= distributionPenalty * 8;

    return score;
  }

  // =========================
  // 📌 LOAD (ניקוי לוגי)
  // =========================
  private isRealLesson(a: any): boolean {
    return a.subjectId !== "00000000-0000-0000-0000-000000000001";
  }

  private getDayLoad(day: number): number {
    return this.state.assignments.filter(
      a => a.day === day && this.isRealLesson(a)
    ).length;
  }

  private getDayDistributionPenalty(day: number): number {
    const hoursUsed = this.state.assignments.filter(
      a => a.day === day && this.isRealLesson(a)
    ).length;

    if (hoursUsed >= 5) return 5;
    if (hoursUsed >= 3) return 3;

    return 0;
  }


}