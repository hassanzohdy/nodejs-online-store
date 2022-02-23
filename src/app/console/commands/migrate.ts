import { migrateAll } from "app/migrations";
import chalk from "chalk";
import { Command } from "core/console";
import database from "core/db";
import { exit } from "process";

const migrationCommand: Command = {
  name: "migrate",
  description: "Migrate database",
  handle: () => {
    database.on("connection", async () => {
      console.log(chalk.yellow("Migrating..."));
      await migrateAll();
      exit(0);
    });
  },
};

export default migrationCommand;
