export function canPlaceHomeroom(state, teacher, classItem, slot) {
  if (slot.day !== 0) return false;

  if (!state.isSlotFree(slot.day, slot.hour)) return false;
  if (state.isBlocked(slot.day, slot.hour)) return false;

  const isTeacherAvailable = state.isTeacherAvailable(
    teacher.teacherID,
    slot.day,
    slot.hour
  );

  if (!isTeacherAvailable) return false;

  return true;
}