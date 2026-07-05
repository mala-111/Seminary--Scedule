import { SchedulerState } from "../models/SchedulerState";
import { PlacementEngine } from "./PlacementEngine";
import { SchedulerLogger } from "../services/SchedulerLogger";
import { ScheduleDataLoader } from "../db/ScheduleDataLoader";
import { TimeGridBuilder } from "./TimeGridBuilder";
import { LessonDemandBuilder } from "./LessonDemandBuilder";
import { ScheduleRepository } from "../db/ScheduleRepository";

export class SchedulerEngine {
  private logger = new SchedulerLogger();

  async run() {
    const loader = new ScheduleDataLoader();
    const input = await loader.load();

    this.validateInput(input);

    const state = new SchedulerState(input);
    const gridBuilder = new TimeGridBuilder();
    state.setGrid(gridBuilder.build(input.settings));

    console.log(
  "HAS LESSON SUBJECT?",
  state.input.teacherToSubject.some(
    t => t.subjectID === "8316548F-3393-4CE1-B32F-95A3F901D795"
  )
);

    // 1. בניית דרישות
    const demandBuilder = new LessonDemandBuilder(state);
    const demands = demandBuilder.build();

    

    // 2. שיבוץ חכם (כאן בעתיד Backtracking)
    const engine = new PlacementEngine(state, this.logger);
    engine.run(demands); // שינוי חשוב!

    // 3. ניקוי תוצאה
    const result = state.exportSchedule();
    const filtered = this.filterValid(result);

    // 4. שמירה
    await new ScheduleRepository().save(filtered);

    return filtered;
  }

  private validateInput(input: any) {
    if (!input.teachers?.length) throw new Error("No teachers");
    if (!input.allClasses?.length) throw new Error("No classes");
    if (!input.subjects?.length) throw new Error("No subjects");
  }

  private filterValid(result: any[]) {
    const isGuid = (v: string) =>
      /^[0-9a-fA-F-]{36}$/.test(v);

    return result.filter(a =>
      isGuid(a.teacherId) &&
      isGuid(a.classId) &&
      isGuid(a.subjectId)
    );
  }
}