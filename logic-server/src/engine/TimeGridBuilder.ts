import { TimeSlot } from "../models/SchedulerState";

export interface TimeGridSettings {
  days: number;
  hoursPerDay: number;
  breakHours?: number[];
}

export function buildTimeGrid(settings: TimeGridSettings): TimeSlot[] {
  const grid: TimeSlot[] = [];

  const breakSet = new Set(settings.breakHours || []);

  for (let day = 0; day < settings.days; day++) {
    for (let hour = 0; hour < settings.hoursPerDay; hour++) {

      // חסימת שעות הפסקה
      const isBreak = breakSet.has(hour);

      grid.push({
        day,
        hour,
        isFree: !isBreak,
      });
    }
  }

  return grid;
}

