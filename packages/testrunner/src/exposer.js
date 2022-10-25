import { expose } from "threads/worker";

import worker from "./worker.js";

expose(worker);
