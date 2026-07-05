import { SchedulerState } from "../models/SchedulerState";
import { ConstraintEngine } from "./ConstraintEngine";
import { SlotSelector } from "../Placement/SlotSelector";
import { SchedulerLogger } from "../services/SchedulerLogger";
import { LessonDemand } from "../types/LessonDemand";
import { SlotScoringEngine } from "../engine/SlotScoringEngine";

export class PlacementEngine {
  private slotSelector: SlotSelector;
  private constraints: ConstraintEngine;
  private scoring: SlotScoringEngine;

  constructor(
    private state: SchedulerState,
    private logger: SchedulerLogger
  ) {
    this.slotSelector = new SlotSelector(state);
    this.constraints = new ConstraintEngine(state);
    this.scoring = new SlotScoringEngine(state);
  }

  run(demands: LessonDemand[]) {
    console.log("START PLACEMENT");
    console.log("demands:", demands.length);

    demands.sort((a, b) => b.priority - a.priority);

    for (const demand of demands) {
      this.tryPlace(demand);
    }
  }

  private tryPlace(demand: LessonDemand) {
    console.log(
      "TRY PLACE:",
      demand.classId,
      demand.subjectId,
      "teachers:",
      demand.teacherCandidates.length
    );
    let remaining = demand.remainingHours;
    let attempts = 0;

    const classItem = this.state.getClassById(demand.classId);
    const subject = this.state.getSubjectById(demand.subjectId);

    if (!classItem || !subject) return;

    while (remaining > 0 && attempts < 300) {
      attempts++;

      const slot = this.slotSelector.findBestSlot();
      if (!slot) {
        console.log("NO SLOT FOUND");
        continue;
      }
      const teachers = this.state.teachers.filter(t =>
        demand.teacherCandidates.includes(t.teacherID)
      );
      console.log(
        "Valid teachers:",
        "/",
        teachers.length
      );

      if (!teachers.length) continue;

      // 1. קודם סינון לפי Constraints
      const validTeachers = [];

      for (const t of teachers) {
        const result = this.constraints.canPlace(
          t,
          classItem,
          subject,
          slot.day,
          slot.hour
        );

        console.log(
          "Teacher",
          t.teacherID,
          "=>",
          result.ok,
          result.reason
        );

        if (result.ok) {
          validTeachers.push(t);
        }
      }

      console.log("Valid teachers:", validTeachers.length, "/", teachers.length);

      if (!validTeachers.length) continue;
      console.log(
        "PLACE:",
        demand.classId,
        demand.subjectId,
        slot.day,
        slot.hour
      );
      // 2. בחירת המורה עם Score הכי גבוה
      const best = validTeachers
        .map(t => ({
          teacher: t,
          score: this.scoring.evaluate({
            slot,
            teacherId: t.teacherID,
            classId: demand.classId
          })
        }))
        .sort((a, b) => b.score - a.score)[0];

      if (!best) continue;

      const teacher = best.teacher;

      const ok = this.constraints.canPlace(
        teacher,
        classItem,
        subject,
        slot.day,
        slot.hour
      );

      if (!ok.ok) {
        this.logger.rejected("DEMAND", ok.reason ?? "blocked");
        continue;
      }

      this.state.addAssignment({
        teacherId: teacher.teacherID,
        classId: demand.classId,
        subjectId: demand.subjectId,
        day: slot.day,
        hour: slot.hour,
      });

      this.state.decreaseTeacherHours(teacher.teacherID);

      remaining--;
    }
  }
}