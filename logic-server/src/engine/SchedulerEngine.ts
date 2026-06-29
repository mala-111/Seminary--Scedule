import { SchedulerState } from "../models/SchedulerState";
import { PlacementEngine } from "./PlacementEngine";
import { SchedulerLogger } from "../services/SchedulerLogger";
import { ScheduleDataLoader } from "../db/ScheduleDataLoader";
import { buildTimeGrid } from "./TimeGridBuilder";
import { ScheduleRepository } from "../db/ScheduleRepository";
export class SchedulerEngine {
  private logger = new SchedulerLogger();

  async run() {
    const loader = new ScheduleDataLoader();
    const input = await loader.load();

    const state = new SchedulerState(input);

    state.setGrid(buildTimeGrid(input.settings));

    const engine = new PlacementEngine(state, this.logger);
    engine.run();

    const isValidGuid = (v: string) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);


    const result = state.exportSchedule();

    const filtered = result.filter(a =>
      isValidGuid(a.teacherId) &&
      isValidGuid(a.classId) &&
      isValidGuid(a.subjectId)
    );
    const repo = new ScheduleRepository();

    await repo.save(filtered);


    return result;
  }
}