export function canPlaceGrouping(state, subject, classes, slot) {
  const classIds = classes.map(c => c.allClassesID);

  const allFree = classes.every(c =>
    state.isClassFreeAt(c.allClassesID, slot.day, slot.hour)
  );

  if (!allFree) return false;
  if (state.isBlocked(slot.day, slot.hour)) return false;
  if (state.isGroupLocked(classIds, slot.day, slot.hour)) return false;

  return true;
}