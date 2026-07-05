export type LogLevel = "info" | "success" | "warn" | "error";

export interface LogEntry {
  time: string;
  step: string;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
}

export class SchedulerLogger {
  private logs: LogEntry[] = [];
  private enabled = true;
  private maxLogs = 5000;

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

  log(step: string, message: string, level: LogLevel = "info", data?: Record<string, any>) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      time: new Date().toISOString(),
      step,
      level,
      message,
      data,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const prefix =
      level === "success" ? "🟢" :
      level === "warn" ? "🟡" :
      level === "error" ? "🔴" : "🔵";

    console.log(`${prefix} [${step}] ${message}`, data ?? "");
  }

  tryPlace(step: string, teacherId: string, classId: string, day: number, hour: number) {
    this.log(step, "ניסיון שיבוץ", "info", {
      teacherId,
      classId,
      day,
      hour,
    });
  }

  placed(step: string, teacherId: string, classId: string, subjectId: string) {
    this.log(step, "שובץ בהצלחה", "success", {
      teacherId,
      classId,
      subjectId,
    });
  }

  rejected(
    step: string,
    reason: string,
    data?: { teacherId?: string; classId?: string; slot?: { day: number; hour: number } }
  ) {
    this.log(step, `נדחה: ${reason}`, "warn", data);
  }

  groupBlocked(step: string, type: "class" | "teacher" | "slot", ids: string[]) {
    this.log(step, "קבוצה נחסמה", "warn", { type, ids });
  }
}