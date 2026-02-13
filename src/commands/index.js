import * as ping from './ping.js';

export const commands = {
  ping: ping,
};

export function getCommand(commandName) {
  return commands[commandName] || null;
}

export function getAllCommands() {
  return Object.values(commands);
}
