import sql from "mssql";
import { SchedulerInput } from "../models/SchedulerState";

export class ScheduleDataLoader {
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

  async load(): Promise<SchedulerInput> {
    await this.pool.connect();

    const teachers = await this.pool.request().query("SELECT * FROM Teachers");
    const grades = await this.pool.request().query("SELECT * FROM Grades");
    const allClasses = await this.pool.request().query("SELECT * FROM AllClasses");
    const subjects = await this.pool.request().query("SELECT * FROM Subjects");
    console.log("Subjects from DB:");
    console.log(subjects.recordset);

    const requirements = await this.pool
      .request()
      .query("SELECT * FROM ClassSubjectRequirements");

    const teacherToSubject = await this.pool
      .request()
      .query("SELECT * FROM TeacherToSubjects");
    console.log("TeacherToSubjects from DB:");
    console.log(teacherToSubject.recordset);
    const hoursBooked = await this.pool
      .request()
      .query("SELECT * FROM HoursBooked");

    const daughtersTeacher = await this.pool
      .request()
      .query("SELECT * FROM DaughtersTeachers");

    return {
      teachers: teachers.recordset.map((t: any) => ({
        teacherID: t.TeacherID,
        weeklyHours: t.WeeklyHours,
        isClassTeacher: t.IsClassTeacher,
        className: t.ClassName,
      })),

      gradeLevels: grades.recordset.map((g: any) => ({
        gradeId: g.GradeId,
        name: g.Name,
      })),

      allClasses: allClasses.recordset.map((c: any) => ({
        allClassesID: c.AllClassesID,
        className: c.ClassName,
        gradeId: c.GradeId,
      })),

      subjects: subjects.recordset.map((s: any) => ({
        subjectID: s.SubjectID,
        name: s.Name,
        category: s.Category,
      })),

      classSubjectRequirements: requirements.recordset.map((r: any) => ({
        classSubjectRequirementId: r.ClassSubjectRequirementId,
        allClassesID: r.AllClassesID,
        subjectID: r.SubjectID,
        weeklyHoursRequired: r.WeeklyHoursRequired,
      })),

      teacherToSubject: teacherToSubject.recordset.map((t: any) => ({
        teacherID: t.TeacherID,
        subjectID: t.SubjectID,
        classID: t.ClassID,
      })),


      hoursBooked: hoursBooked.recordset,
      daughtersTeacher: daughtersTeacher.recordset,

      settings: {
        days: 5,
        hoursPerDay: 8,
      },
    };
  }
}