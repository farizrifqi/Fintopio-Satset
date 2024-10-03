import fs from "node:fs";
import { Fintopio } from "./bot/Fintopio";
import { InitData } from "./types/Satset";
(async () => {
  const queries = fs
    .readFileSync("query.txt", "utf8")
    .split("\n")
    .filter((q) => q !== "")
    .map((q) => q.replace(/\r|\s/g, ""));
  const initdata: InitData[] = queries.map((q: string) => ({ queryId: q }));
  const fintopio = new Fintopio(initdata, {
    verbose: true,
  });
  await fintopio.init();
  await fintopio.run();
})();
