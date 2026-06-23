export function placeGrouping(state) {
  const subjects = state.getGroupingSubjects();

for (const subject of subjects) {
  const classes = state.getClassesByLevel(subject.level);

  const slot = state.findCommonFreeSlot(classes);

  for (const c of classes) {
    const teacher = state.findTeacherFor(subject, c);

    state.assign(slot, {
      teacher,
      class: c,
      subject,
    });

    teacher.remainingHours--;
  }
}
}