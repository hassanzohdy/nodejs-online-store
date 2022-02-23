import "./index";
import { migrateAll } from "./app/migrations";
import database from "core/db";
import { exit } from "process";

database.on("connection", async () => {
  await migrateAll();
  exit(0);
});
