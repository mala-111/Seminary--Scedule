import { TimeSlot } from "../models/SchedulerState";

export interface TimeGridSettings {
  days: number;
  hoursPerDay: number;

  breakHours?: number[];
  blockedDays?: number[];
  blockedHours?: number[];
}

export class TimeGridBuilder {
  build(settings: TimeGridSettings): TimeSlot[] {
    const grid: TimeSlot[] = [];

    const breakSet = new Set(settings.breakHours ?? []);
    const blockedDays = new Set(settings.blockedDays ?? []);
    const blockedHours = new Set(settings.blockedHours ?? []);

    for (let day = 0; day < settings.days; day++) {
      for (let hour = 0; hour < settings.hoursPerDay; hour++) {

        const isBreak = breakSet.has(hour);
        const isBlocked =
          blockedDays.has(day) ||
          blockedHours.has(hour);

        grid.push({
          day,
          hour,
          isFree: !isBreak && !isBlocked,
        });
      }
    }

    return grid;
  }
}