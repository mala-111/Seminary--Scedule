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
    await this.pool.connect();

    const transaction = new sql.Transaction(this.pool);

    try {
      await transaction.begin();

      const request = new sql.Request(transaction);

      // ⚠️ לפי הטבלה שלך
      await request.query(`DELETE FROM Schedules`);

      for (const a of assignments) {
        await request
          .input("teacherId", sql.VarChar, a.teacherId)
          .input("classId", sql.VarChar, a.classId)
          .input("subjectId", sql.VarChar, a.subjectId)
          .input("day", sql.Int, a.day)
          .input("hour", sql.Int, a.hour)
          .query(`
            INSERT INTO Schedules (teacherId, classId, subjectId, day, hour)
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