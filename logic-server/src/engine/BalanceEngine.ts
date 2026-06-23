export function balance(state) {
  for (const teacher of state.teachers) {
    if (teacher.hasTooManyConsecutiveHours()) {
      state.swapSlots(teacher);
    }
  }
}