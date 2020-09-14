const commands = require('./commandcollection');
const UWP = require("./commands/uwp");

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

const getCommandObject = (prefix, msg) => {
  const commandText = msg.content.substring(prefix.length).trim();
  const tokens = commandText.toUpperCase().split(' ');
  if (tokens[0] === '')
    return null;
  const command = tokens[0];
  for (const cc in commands) {
    if (command === commands[cc].command) {
      return new commands[cc](prefix, msg);
    }
  }

  if (UWPRegex.exec(commandText)) {
    return new UWP(prefix, msg);
  }

  // if the message does not contain a command and is not a UWP then assume it is a system name
  return new commands["System"](prefix, msg);
  //return null;
}

exports.getCommandObject = getCommandObject;
