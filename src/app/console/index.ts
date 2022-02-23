import startConsoleApplication, { registerCommands } from "core/console";
import migrationCommand from "./commands/migrate";

registerCommands([
  // commands list
  migrationCommand,
]);

startConsoleApplication();
