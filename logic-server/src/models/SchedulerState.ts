import { Teacher } from "../types/Teacher";
import { Class as GradeLevel } from "../types/Class";
import { AllClasses } from "../types/allClasses";
import { Subject } from "../types/Subject";

export interface TimeSlot {
  day: number;
  hour: number;
  isFree: boolean;
}

export interface Assignment {
  teacherId: string;
  classId: string;
  subjectId: string;
  day: number;
  hour: number;
}

export interface SchedulerInput {
  teachers: Teacher[];
  gradeLevels: GradeLevel[];
  allClasses: AllClasses[];
  subjects: Subject[];

  classSubjectRequirements: any[];
  teacherToSubject: any[];
  hoursBooked: any[];
  daughtersTeacher: any[];
  settings: any;
}


export class SchedulerState {
  public teachers: Teacher[] = [];
  public gradeLevels: GradeLevel[] = [];
  public allClasses: AllClasses[] = [];
  public subjects: Subject[] = [];

  public input: SchedulerInput;

  public grid: TimeSlot[] = [];
  public assignments: Assignment[] = [];

  private occupied = new Set<string>();
  private lockedGroups = new Set<string>();
 private blockedSlots = new Set<string>();
  public teacherRemainingHours = new Map<string, number>();

  constructor(input: SchedulerInput) {
    this.input = input;

    this.teachers = input.teachers || [];
    this.gradeLevels = input.gradeLevels || [];
    this.allClasses = input.allClasses || [];
    this.subjects = input.subjects || [];

    for (const t of this.teachers) {
      this.teacherRemainingHours.set(t.teacherID, t.weeklyHours);
    }
  }

  // =========================
  // GRID
  // =========================

  setGrid(grid: TimeSlot[]) {
    this.grid = grid;
  }

  getFreeSlots() {
    return this.grid.filter(s => s.isFree);
  }

  markSlot(day: number, hour: number, free: boolean) {
    const slot = this.grid.find(s => s.day === day && s.hour === hour);
    if (slot) slot.isFree = free;
  }

  isSlotFree(day: number, hour: number) {
    return this.grid.some(s => s.day === day && s.hour === hour && s.isFree);
  }
 isSlotTaken(day: number, hour: number): boolean {
  return this.assignments.some(a => a.day === day && a.hour === hour);
}
  // =========================
  // ASSIGNMENTS
  // =========================
  addAssignment(a: Assignment) {
    if (a.subjectId === "00000000-0000-0000-0000-000000000001") {
      console.log("🧠 HOMEROOM DETECTED IN STATE");
    }
    console.log("➡️ ADD ASSIGNMENT RECEIVED:", {
      teacherId: a.teacherId,
      classId: a.classId,
      subjectId: a.subjectId,
      day: a.day,
      hour: a.hour
    });

    const key = `${a.teacherId}_${a.classId}_${a.subjectId}_${a.day}_${a.hour}`;
    if (this.occupied.has(key)) return;
    
    if (a.subjectId === "00000000-0000-0000-0000-000000000001") {
  this.markSlot(a.day, a.hour, false);
  return; // 🚫 לא שומרים HOMEROOM כ-assignment
}
    this.occupied.add(key);

    // ❗ רק אם זה לא HOMEROOM
    if (a.subjectId === "00000000-0000-0000-0000-000000000001") {
  this.blockSlot(a.day, a.hour);
  return;
}

this.assignments.push(a);
this.markSlot(a.day, a.hour, false);
this.decreaseTeacherHours(a.teacherId);

  }
  blockSlot(day: number, hour: number) {
  this.blockedSlots.add(`${day}_${hour}`);
}

isBlocked(day: number, hour: number): boolean {
  return this.blockedSlots.has(`${day}_${hour}`);
}

getBlockedSlots() {
  return Array.from(this.blockedSlots);
}
  // =========================
  // TEACHER HOURS
  // =========================

  decreaseTeacherHours(teacherId: string) {
    const current = this.teacherRemainingHours.get(teacherId) ?? 0;
    this.teacherRemainingHours.set(teacherId, Math.max(0, current - 1));
  }

  getTeacherRemainingHours(id: string) {
    return this.teacherRemainingHours.get(id) ?? 0;
  }

  // =========================
  // LOOKUPS
  // =========================
  isDaughtersTeacher(teacherId: string, classId: string): boolean {
    return (this.input.daughtersTeacher ?? []).some(
      d =>
        d.teacherID === teacherId &&
        d.allClassesID === classId
    );
  }

  getTeacherById(id: string) {
    return this.teachers.find(t => t.teacherID === id);
  }

  getClassById(id: string) {
    return this.allClasses.find(c => c.allClassesID === id);
  }

  getClassesByGradeLevel(level: string) {
    return this.allClasses.filter(c => c.className.startsWith(level));
  }

  getSubjectById(id: string) {
    return this.subjects.find(s => s.subjectID === id);
  }
  isClassFreeAt(classId: string, day: number, hour: number): boolean {
    return !this.assignments.some(
      a =>
        a.classId === classId &&
        a.day === day &&
        a.hour === hour
    );
  }
  areClassesFree(classes: AllClasses[], day: number, hour: number): boolean {
    return classes.every(c =>
      this.isClassFreeAt(c.allClassesID!, day, hour)
    );
  }
  lockGroup(classIds: string[], day: number, hour: number) {
    const key = `${day}_${hour}_${classIds.sort().join("|")}`;
    this.lockedGroups.add(key);
  }

  isGroupLocked(classIds: string[], day: number, hour: number): boolean {
    const key = `${day}_${hour}_${classIds.sort().join("|")}`;
    return this.lockedGroups.has(key);
  }
  isClassFree(classId: string, day: number, hour: number): boolean {
    return !this.assignments.some(
      a => a.classId === classId && a.day === day && a.hour === hour
    );

  }
  getClassRemainingHours(classId: string, subjectId: string) {
    const req = this.input.classSubjectRequirements.find(
      r =>
        r.allClassesID === classId &&
        r.subjectID === subjectId
    );

    if (!req) return 0;

    const scheduled = this.assignments.filter(
      a =>
        a.classId === classId &&
        a.subjectId === subjectId
    ).length;

    return req.weeklyHoursRequired - scheduled;
  }

  // =========================
  // 📤 EXPORT
  // =========================

  exportSchedule() {
    return this.assignments;
  }
}