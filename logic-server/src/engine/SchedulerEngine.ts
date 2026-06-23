import { SchedulerState } from "../models/SchedulerState";
import { PlacementEngine } from "./PlacementEngine";
import { TimeGridBuilder } from "../Placement/TimeGridBuilder";
import { SchedulerLogger } from "../services/SchedulerLogger";
import { ScheduleDataLoader } from "../db/ScheduleDataLoader";
import { buildTimeGrid } from "./TimeGridBuilder";
import { ScheduleRepository } from "../db/ScheduleRepository";
export class SchedulerEngine {
  private logger = new SchedulerLogger();

  async run(input) {
  const loader = new ScheduleDataLoader();
  

  const state = new SchedulerState(input);

  state.setGrid(buildTimeGrid(input.settings));

  const engine = new PlacementEngine(state, this.logger);
  engine.run();

  const result = state.exportSchedule();

  const repo = new ScheduleRepository();
  await repo.save(result);

  return result;
}
}