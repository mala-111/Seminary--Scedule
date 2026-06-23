import { TimeSlot } from "../models/SchedulerState";

export interface TimeGridSettings {
  days: number;
  hoursPerDay: number;

  blockedDays?: number[];
  blockedHours?: number[];
}

export class TimeGridBuilder {
  build(settings: TimeGridSettings): TimeSlot[] {
    const grid: TimeSlot[] = [];

    const blockedDays = new Set(settings.blockedDays ?? []);
    const blockedHours = new Set(settings.blockedHours ?? []);

    for (let day = 0; day < settings.days; day++) {
      for (let hour = 0; hour < settings.hoursPerDay; hour++) {

        const isBlocked =
          blockedDays.has(day) || blockedHours.has(hour);

        grid.push({
          day,
          hour,
          isFree: !isBlocked,
        });
      }
    }

    return grid;
  }
}