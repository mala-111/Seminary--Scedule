export function placeHomeroom(state) {
  const DAY = 0; // יום ראשון

  for (const classItem of state.allClasses) {
    if (!classItem?.allClassesID || !classItem?.className) continue;

    const teacher = state.teachers.find(t =>
      (t.className || "").trim() === (classItem.className || "").trim()
    );

    if (!teacher) continue;

    for (let hour = 0; hour < 2; hour++) {
      const slot = state.getSlot(DAY, hour);

      // ❗ בדיקות חובה
      if (!slot || !slot.isFree) continue;

      if (state.isTeacherBusy?.(teacher.teacherID, DAY, hour)) continue;

      if (state.isClassBusy?.(classItem.allClassesID, DAY, hour)) continue;

      state.assign(slot, {
        teacherId: teacher.teacherID,
        classId: classItem.allClassesID,
        subjectId: "HOMEROOM",
        day: DAY,
        hour,
      });

      if (teacher.weeklyHours > 0) {
        teacher.weeklyHours--;
      }
    }
  }
}