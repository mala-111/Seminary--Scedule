export function applyFreeDay(state) {
  for (const teacher of state.teachers) {
    const preferred = teacher.freeDayPriority;

    if (state.canShiftToDay(teacher, preferred.A)) continue;
    if (state.canShiftToDay(teacher, preferred.B)) continue;
    state.shiftTo(preferred.C);
  }
}