import { argv, exit } from "node:process";

import { add } from "./commands/add";
import { init } from "./commands/init";

const command = argv[2];
const handler = command === "add" ? add : init;

handler().catch((e: unknown) => {
  console.error(e);
  exit(1);
});
