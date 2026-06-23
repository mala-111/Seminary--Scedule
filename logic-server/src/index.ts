import { SchedulerEngine } from "../src/engine/SchedulerEngine";

const engine = new SchedulerEngine();

async function main() {
  const output = await engine.run();

  console.log("RESULT:", output.result);
  console.log("CLASSES IDS:", output.debug.classes.map(c => c.allClassesID));
  console.log("REQ:", output.debug.requirements);
}

main();