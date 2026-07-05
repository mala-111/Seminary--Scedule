import sql from "mssql";
import { Assignment } from "../models/SchedulerState";

export class ScheduleRepository {
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = new sql.ConnectionPool({
      user: "SA",
      password: "SeminarySchedule123!",
      server: "localhost",
      database: "ScheduleDb",
      port: 1434,
      options: {
        trustServerCertificate: true,
      },
    });
  }

  async save(assignments: Assignment[]) {
    if (!this.pool.connected) {
      await this.pool.connect();
    }

    const transaction = new sql.Transaction(this.pool);

    try {

      await transaction.begin();
      // ⚠️ לפי הטבלה שלך
      for (const a of assignments) {
        const request = new sql.Request(transaction);

        await request
  .input("teacherId", sql.UniqueIdentifier, a.teacherId)
  .input("classId", sql.UniqueIdentifier, a.classId)
  .input("subjectId", sql.UniqueIdentifier, a.subjectId)
  .input("day", sql.Int, a.day)
  .input("hour", sql.Int, a.hour)
  .query(`
    INSERT INTO Schedules (TeacherID, AllClassesID, SubjectID, Day, Hour)
    VALUES (@teacherId, @classId, @subjectId, @day, @hour)
  `);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}