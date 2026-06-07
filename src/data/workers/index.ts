//src/data/workers/index.ts
import { WorkerProfile } from "@/types/worker";
import { plumbers } from "./plumbers";
import { electricians } from "./electricians";
import { cleaners } from "./cleaners";
import { landscapers } from "./landscapers";
import { masons } from "./masons";

export const mockWorkers: WorkerProfile[] = [
  ...plumbers,
  ...electricians,
  ...cleaners,
  ...landscapers,
  ...masons
];