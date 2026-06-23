import { SchedulerState } from "../models/SchedulerState";
import { ConstraintEngine } from "./ConstraintEngine";
import { Subject } from "../types/Subject";
import { AllClasses } from "../types/allClasses";
import { SlotSelector } from "../Placement/SlotSelector";
import { SchedulerLogger } from "../services/SchedulerLogger";

export class PlacementEngine {
  private slotSelector: SlotSelector;
  private constraints: ConstraintEngine;

  constructor(
    private state: SchedulerState,
    private logger: SchedulerLogger
  ) {
    this.slotSelector = new SlotSelector(state);
    this.constraints = new ConstraintEngine(state);
  }

  // =========================
  // 🚀 ENTRY
  // =========================
  run() {
    console.log("START PLACEMENT");
    console.log("teachers:", this.state.teachers.length);
    console.log("subjects:", this.state.subjects.length);
    console.log("requirements:", this.state.input.classSubjectRequirements.length);
    console.log("free slots:", this.state.getFreeSlots().length);

    this.placeHomeroom();
    this.placeGrouping();
    this.placeRegular();
  }

  // =========================
  // HOMEROOM
  // =========================
  private placeHomeroom() {
    const teachers = this.state.teachers.filter(t => t.isClassTeacher);

    for (const teacher of teachers) {
      const classItem = this.state.allClasses.find(
        c => c.className === teacher.className
      );

      if (!classItem) continue;

      for (let hour = 0; hour < 2; hour++) {
        const day = 0;

        if (!this.state.isSlotFree(day, hour)) continue;

        const ok = this.constraints.canPlace(
          teacher,
          classItem,
          this.dummy(),
          day,
          hour
        );

        if (!ok.ok) {
          this.logger.rejected("HOMEROOM", ok.reason ?? "blocked");
          continue;
        }

        this.state.addAssignment({
          teacherId: teacher.teacherID,
          classId: classItem.allClassesID!,
          subjectId: "HOMEROOM",
          day,
          hour,
        });

        this.state.decreaseTeacherHours(teacher.teacherID);

        this.logger.placed(
          "HOMEROOM",
          teacher.teacherID,
          classItem.allClassesID!,
          "HOMEROOM"
        );
      }
    }
  }

  // =========================
  // GROUPING
  // =========================
  private placeGrouping() {
    const subjects = this.state.subjects.filter(s => s.category === "Grouping");
    const grouped = this.groupByLevel();

    for (const subject of subjects) {
      for (const level in grouped) {
        const classes = grouped[level];

        const slot = this.slotSelector.findBestSlot();
        if (!slot) continue;

        const classIds = classes.map(c => c.allClassesID!);

        if (this.state.isGroupLocked(classIds, slot.day, slot.hour)) {
          continue;
        }

        const teacher = this.state.teachers.find(t =>
          this.state.input.teacherToSubject.some(x =>
            x.teacherID === t.teacherID &&
            x.subjectID === subject.subjectID &&
            x.className.startsWith(level)
          )
        );

        if (!teacher) continue;

        const allFree = classes.every(c =>
          this.state.isClassFree(c.allClassesID!, slot.day, slot.hour)
        );

        if (!allFree) {
          this.logger.rejected("GROUPING", "class occupied");
          continue;
        }

        const ok = this.constraints.canPlace(
          teacher,
          classes[0],
          subject,
          slot.day,
          slot.hour
        );

        if (!ok.ok) {
          this.logger.rejected("GROUPING", ok.reason ?? "blocked");
          continue;
        }

        for (const c of classes) {
          this.state.addAssignment({
            teacherId: teacher.teacherID,
            classId: c.allClassesID!,
            subjectId: subject.subjectID,
            day: slot.day,
            hour: slot.hour,
          });
        }

        this.state.decreaseTeacherHours(teacher.teacherID);

        this.state.lockGroup(classIds, slot.day, slot.hour);

        this.logger.placed(
          "GROUPING",
          teacher.teacherID,
          classIds[0],
          subject.subjectID
        );
      }
    }
  }

  // =========================
  // REGULAR
  // =========================
  private placeRegular() {
    for (const req of this.state.input.classSubjectRequirements) {
      const classItem = this.state.allClasses.find(
        c => c.allClassesID === req.allClassesID
      );

      const subject = this.state.subjects.find(
        s => s.subjectID === req.subjectID
      );

      if (!classItem || !subject) continue;

if (!classItem || !subject) {
  console.log("MISSING DATA:", req);
  continue;
}

console.log("TRY:", subject.subjectID, classItem.allClassesID);

      let remaining = req.weeklyHoursRequired;
      let attempts = 0;

      while (remaining > 0 && attempts < 300) {
        attempts++;

        const slot = this.slotSelector.findBestSlot();
        if (!slot) continue;

        const teacher = this.state.teachers.find(t =>
          this.state.input.teacherToSubject.some(x =>
            x.teacherID === t.teacherID &&
            x.subjectID === subject.subjectID
          )
        );

        if (!teacher) break;

        const ok = this.constraints.canPlace(
          teacher,
          classItem,
          subject,
          slot.day,
          slot.hour
        );

        if (!ok.ok) {
          this.logger.rejected("REGULAR", ok.reason ?? "blocked");
          continue;
        }

        this.state.addAssignment({
          teacherId: teacher.teacherID,
          classId: classItem.allClassesID!,
          subjectId: subject.subjectID,
          day: slot.day,
          hour: slot.hour,
        });

        this.state.decreaseTeacherHours(teacher.teacherID);

        remaining--;
      }
    }
  }

  // =========================
  // HELPERS
  // =========================
  private groupByLevel(): Record<string, AllClasses[]> {
  const map: Record<string, AllClasses[]> = {};

  for (const c of this.state.allClasses) {
    if (!c || !c.className) continue;

    const level = String(c.className).charAt(0);

    if (!map[level]) {
      map[level] = [];
    }

    map[level].push(c);
  }

  return map;
}

  private dummy(): Subject {
    return {
      subjectID: "HOMEROOM",
      name: "Homeroom",
      category: "Core",
    };
  }
}