import { Command } from "./types";

let commands: Command[] = [];

export function registerCommands(moreCommands: Command[]) {
  commands = [...commands, ...moreCommands];
}

export function getCommandsList(): Command[] {
  return commands;
}
