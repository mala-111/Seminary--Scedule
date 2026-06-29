import { SchedulerEngine } from "../src/engine/SchedulerEngine";

const engine = new SchedulerEngine();

async function main() {
  const output = await engine.run();

  console.log(output);
}

main();