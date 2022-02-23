import { getCommandsList } from "./commands";

// TODO
const Wizard = {
  call(commandName: string, args: any[] = [], options: any = {}) {
    const commands = getCommandsList();

    for (let command of commands) {
      if (command.name !== commandName) continue;

      command.handle(args, options, command);
    }
  },
};

export default Wizard;
