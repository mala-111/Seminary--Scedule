export type LogLevel = "info" | "success" | "warn" | "error";

export interface LogEntry {
  time: number;
  step: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export class SchedulerLogger {
  private logs: LogEntry[] = [];
  private enabled = true;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }

  // =========================
  // MAIN LOG FUNCTION
  // =========================
  log(step: string, message: string, level: LogLevel = "info", data?: any) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      time: Date.now(),
      step,
      level,
      message,
      data,
    };

    this.logs.push(entry);

    // הדפסה בזמן אמת לקונסול
    const prefix =
      level === "success" ? "🟢" :
      level === "warn" ? "🟡" :
      level === "error" ? "🔴" : "🔵";

    console.log(`${prefix} [${step}] ${message}`, data ?? "");
  }

  // =========================
  // HELPERS נוחים לאלגוריתם
  // =========================

  tryPlace(step: string, teacherId: string, classId: string, day: number, hour: number) {
    this.log(step, `ניסיון שיבוץ`, "info", {
      teacherId,
      classId,
      day,
      hour,
    });
  }

  placed(step: string, teacherId: string, classId: string, subjectId: string) {
    this.log(step, `שובץ בהצלחה`, "success", {
      teacherId,
      classId,
      subjectId,
    });
  }

  rejected(step: string, reason: string, data?: any) {
    this.log(step, `נדחה: ${reason}`, "warn", data);
  }

  groupBlocked(step: string, classIds: string[]) {
    this.log(step, "קבוצה נחסמה", "warn", { classIds });
  }
}