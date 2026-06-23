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

  // =========================
  // ASSIGNMENTS
  // =========================

  addAssignment(a: Assignment) {
    const key = `${a.teacherId}_${a.classId}_${a.day}_${a.hour}`;
    if (this.occupied.has(key)) return;

    this.assignments.push(a);
    this.occupied.add(key);
    this.markSlot(a.day, a.hour, false);
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
  // =========================
// 📤 EXPORT
// =========================

exportSchedule() {
  return this.assignments;
}
}