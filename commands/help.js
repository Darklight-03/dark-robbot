const config = require('../config.json'); // Import configuration
var Commands = require('../command_loader.js'); // Import list of commands

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var command = "help"; // For logging purposes
	var commandsExpl = [];
	// Array which will have all commands and their corresponding explainations
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var cmdList = Object.keys(Commands.commands);
	// Get all command names (keys) from commands object

	var arg = msg.content.substr(config.commandPrefix.length + command.length + 1 + config.needsSpace);
	// Get possible argument from message
	if (arg) {
		// If there is an argument...
		if (cmdList.indexOf(arg) !== -1) {
			msg.author.send(`**__Syntax for '${arg}' is:__** \`\`\`${config.commandPrefix + " " + arg + " " + Commands.commands[arg].syntax}\`\`\``);
		}
		// ...and the argument is in the command list, send the syntax help for it and set auto-delete to 10s.
		return; // Abort command execution
	}
	for (var i = 0; i < cmdList.length; i++) {
		// Loop through each command (key)
		commandsExpl.push(`'${cmdList[i]}' -- ${Commands.commands[cmdList[i]].desc}`);
		// Push each command including its description into the commandsExpl array
	}
	msg.author.send(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}\n\nUse '${config.commandPrefix + " " + command} <commandname>' to get syntax help on a command!`);
	// Join commandsExpl array with newline seperator and send it all as one message
};
exports.desc = "displays this message"; // Export command description
exports.syntax = "<command to get help on, optional>"; // Export command syntax
