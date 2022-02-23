import { getCommandsList } from "./commands";
import { program, Command as CommanderCommand } from "commander";
import { APPLICATION_VERSION } from "core/application";
import { exit } from "process";

export default function listenToCommands() {
  const commands = getCommandsList();

  program.version(String(APPLICATION_VERSION));

  // program.hook("postAction", () => exit(0));

  for (let command of commands) {
    if (command instanceof CommanderCommand) {
      program.addCommand(command);
    } else {
      let commanderCommand = program
        .command(command.name)
        .description(command.description)
        .action(async function (this: CommanderCommand) {
          await command.handle(this.args, this.opts(), this);
        });

      if (command.options) {
        for (let option of command.options) {
          commanderCommand.option(
            option.name,
            option.description,
            option.defaultValue
          );
        }
      }
    }
  }

  program.parse(process.argv);
}
