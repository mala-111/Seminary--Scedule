import { SchedulerState, TimeSlot } from "../models/SchedulerState";
import { AllClasses } from "../types/allClasses";

export class SlotSelector {
  constructor(private state: SchedulerState) {}

  // =========================
  // 🎯 GROUP SLOT (הגרסה החשובה)
  // =========================
  findBestSlotForGroup(classes: AllClasses[]): TimeSlot | null {
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

      if (this.state.isGroupLocked(classIds, day, hour)) {
        continue;
      }

      const score = this.scoreSlot(slot);

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  // =========================
  // 🎯 REGULAR SLOT
  // =========================
  findBestSlot(): TimeSlot | null {
    const freeSlots = this.state.getFreeSlots();
    if (!freeSlots.length) return null;

    let bestSlot: TimeSlot | null = null;
    let bestScore = -Infinity;

    for (const slot of freeSlots) {
      const score = this.scoreSlot(slot);

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  // =========================
  // 📊 SCORING
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
  // 📌 LOAD
  // =========================
  private getDayLoad(day: number): number {
    return this.state.assignments.filter(a => a.day === day).length;
  }

  // =========================
  // 📌 DISTRIBUTION
  // =========================
  private getDayDistributionPenalty(day: number): number {
    const hoursUsed = this.state.assignments.filter(a => a.day === day).length;

    if (hoursUsed >= 5) return 5;
    if (hoursUsed >= 3) return 3;

    return 0;
  }
}